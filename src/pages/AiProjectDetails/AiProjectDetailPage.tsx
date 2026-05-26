import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './AiProjectDetailPage.css';

// Type definitions based on GitHub API response
interface GithubStats {
    stargazers_count: number;
    forks_count: number;
    subscribers_count: number; // For watchers
    open_issues_count: number;
    language: string;
    updated_at: string;
    html_url: string;
}

interface TechStackItem {
    name: string;
    percentage: number;
    color: string;
}

interface StatusTechItem {
    name: string;
    detail: string;
    color: string;
}

interface Contributor {
    name: string;
    initials: string;
    color: string;
    contributions: number;
}

interface MoreProject {
    name: string;
    stars: number;
    tech: string;
    icon: string;
    repo: string;
}

interface ContributionItem {
    step: number;
    initials: string;
    name: string;
    description: string;
    date: string;
    tag: string;
    commitUrl: string;
}

interface DetailPageData {
    projectName: string;
    author: string;
    tags: string[];
    description: string;
    techStack: TechStackItem[];
    metaTags: string[];
    keyFeaturesText: string;
    statusTechMeta: StatusTechItem[];
    contributors: Contributor[];
    licenseName: string;
    licenseDescription: string;
    moreProjects: MoreProject[];
    contributionProgress: ContributionItem[];
}

type JsonRecord = Record<string, unknown>;

const DETAIL_CACHE_PREFIX = 'ai_project_detail_cache_v2:';
const DETAIL_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MORE_PROJECTS_CACHE_KEY = 'ai_more_projects_rank_cache_v2';
const MORE_PROJECTS_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const AI_EXPERIENCE_IMAGE_POOL = [
    "/AI EXPERIENCE PROJECT/Ninja Labs CN-banner-2-2.jpg",
    "/AI EXPERIENCE PROJECT/Ninja Labs CN-banner-2-1.png",
    "/AI EXPERIENCE PROJECT/Star-Office-UI-INJ.png",
];

const LANGUAGE_COLOR_MAP: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    Solidity: '#AA6746',
    Vue: '#41b883',
    Shell: '#89e051',
};

const CONTRIBUTOR_COLOR_PALETTE = ['#57a8d4', '#86efac', '#fcd34d', '#f87171', '#a78bfa', '#34d399'];

const AiProjectDetailPage: React.FC = () => {
    const { owner, repo } = useParams<{ owner: string, repo: string }>();
    const location = useLocation();
    const [stats, setStats] = useState<GithubStats | null>(null);
    const [detailData, setDetailData] = useState<DetailPageData | null>(null);
    const [loading, setLoading] = useState(true);

    const getStableImageByRepo = (fullRepo: string): string => {
        if (!fullRepo) return AI_EXPERIENCE_IMAGE_POOL[0];
        let hash = 0;
        for (let i = 0; i < fullRepo.length; i++) {
            hash = (hash << 5) - hash + fullRepo.charCodeAt(i);
            hash |= 0;
        }
        return AI_EXPERIENCE_IMAGE_POOL[Math.abs(hash) % AI_EXPERIENCE_IMAGE_POOL.length];
    };
    const routeImage = (location.state as { imageSrc?: string } | null)?.imageSrc;
    const heroImage = routeImage || getStableImageByRepo(`${owner || ''}/${repo || ''}`);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!owner || !repo) {
            setLoading(false);
            return;
        }

        const cacheKey = `${DETAIL_CACHE_PREFIX}${owner}/${repo}`;
        const readCache = (): { stats: GithubStats; detailData: DetailPageData } | null => {
            try {
                const raw = localStorage.getItem(cacheKey);
                if (!raw) return null;
                const parsed = JSON.parse(raw) as { timestamp: number; stats: GithubStats; detailData: DetailPageData };
                if (!parsed?.timestamp || !parsed?.stats || !parsed?.detailData) return null;
                if (Date.now() - parsed.timestamp > DETAIL_CACHE_TTL_MS) return null;
                return { stats: parsed.stats, detailData: parsed.detailData };
            } catch {
                return null;
            }
        };

        const writeCache = (nextStats: GithubStats, nextDetailData: DetailPageData) => {
            try {
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({ timestamp: Date.now(), stats: nextStats, detailData: nextDetailData })
                );
            } catch {
                // ignore cache errors
            }
        };

        const cached = readCache();
        if (cached) {
            setStats(cached.stats);
            setDetailData(cached.detailData);
            setLoading(false);
            return;
        }

        const sheetApiUrl = import.meta.env.VITE_GOOGLE_SHEET_API as string | undefined;
        const isRecord = (value: unknown): value is JsonRecord =>
            typeof value === 'object' && value !== null;
        const asRecord = (value: unknown): JsonRecord =>
            (isRecord(value) ? value : {});
        const asRecordArray = (value: unknown): JsonRecord[] =>
            Array.isArray(value) ? value.filter(isRecord) : [];
        const normalizeRepoFromInput = (value: unknown): string => {
            const raw = String(value || '').trim();
            if (!raw) return '';
            if (raw.includes('github.com/')) {
                try {
                    const url = new URL(raw);
                    const [repoOwner, repoName] = url.pathname.replace(/^\/+/, '').split('/');
                    if (repoOwner && repoName) return `${repoOwner}/${repoName.replace(/\.git$/, '')}`.toLowerCase();
                } catch {
                    return '';
                }
            }
            const [repoOwner, repoName] = raw.split('/');
            return repoOwner && repoName ? `${repoOwner}/${repoName.replace(/\.git$/, '')}`.toLowerCase() : '';
        };

        const safeParseJson = (text: string): unknown => {
            try {
                return JSON.parse(text);
            } catch {
                const start = text.indexOf('{');
                const end = text.lastIndexOf('}');
                if (start >= 0 && end > start) {
                    try {
                        return JSON.parse(text.slice(start, end + 1));
                    } catch {
                        return null;
                    }
                }
                return null;
            }
        };

        const extractRows = (payload: unknown): JsonRecord[] => {
            if (!payload) return [];
            if (Array.isArray(payload)) return asRecordArray(payload);
            if (!isRecord(payload)) return [];

            const directDataRows = asRecordArray(payload.data);
            if (directDataRows.length > 0) return directDataRows;

            const directRows = asRecordArray(payload.rows);
            if (directRows.length > 0) return directRows;

            const table = asRecord(payload.table);
            const cols = Array.isArray(table.cols) ? table.cols : [];
            const rows = Array.isArray(table.rows) ? table.rows : [];
            if (Array.isArray(cols) && Array.isArray(rows)) {
                const headers = cols.map((col) => {
                    const c = asRecord(col);
                    return String(c.label ?? c.id ?? '');
                });
                return rows.map((row) => {
                    const rowRecord = asRecord(row);
                    const cells = Array.isArray(rowRecord.c) ? rowRecord.c : [];
                    return headers.reduce((acc: JsonRecord, header: string, idx: number) => {
                        const cell = asRecord(cells[idx]);
                        acc[header] = cell.v;
                        return acc;
                    }, {});
                });
            }
            return [];
        };

        const normalizeRow = (row: Record<string, unknown>): Record<string, unknown> => {
            return Object.entries(row || {}).reduce((acc, [key, value]) => {
                acc[key.toLowerCase().replace(/[\s_-]/g, '')] = value;
                return acc;
            }, {} as Record<string, unknown>);
        };

        const isApproved = (value: unknown): boolean => {
            const v = String(value ?? '').trim().toLowerCase();
            return ['yes', 'y', 'true', '1', 'approved'].includes(v);
        };

        const readMoreProjectsCache = (): MoreProject[] | null => {
            try {
                const raw = localStorage.getItem(MORE_PROJECTS_CACHE_KEY);
                if (!raw) return null;
                const parsed = JSON.parse(raw) as { timestamp: number; projects: MoreProject[] };
                if (!parsed?.timestamp || !Array.isArray(parsed?.projects)) return null;
                if (Date.now() - parsed.timestamp > MORE_PROJECTS_CACHE_TTL_MS) return null;
                return parsed.projects;
            } catch {
                return null;
            }
        };

        const writeMoreProjectsCache = (projects: MoreProject[]) => {
            try {
                localStorage.setItem(
                    MORE_PROJECTS_CACHE_KEY,
                    JSON.stringify({ timestamp: Date.now(), projects })
                );
            } catch {
                // ignore cache errors
            }
        };

        const fetchGithubDetails = async () => {
            try {
                const githubToken = import.meta.env.VITE_GITHUB_API_KEY;
                const headers: HeadersInit = {
                    'Accept': 'application/vnd.github+json'
                };
                if (githubToken) {
                    headers['Authorization'] = `Bearer ${githubToken}`;
                }

                const [repoRes, langRes, contributorsRes, commitsRes, sheetRes] = await Promise.all([
                    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
                    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
                    fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`, { headers }),
                    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers }),
                    sheetApiUrl ? fetch(sheetApiUrl, { method: 'GET' }) : Promise.resolve(null),
                ]);

                if (!repoRes.ok) {
                    throw new Error(`GitHub repo API error: ${repoRes.status}`);
                }

                const repoData = await repoRes.json();
                const languageData = langRes.ok ? await langRes.json() : {};
                const contributorsData = contributorsRes.ok ? await contributorsRes.json() : [];
                const commitsData = commitsRes.ok ? await commitsRes.json() : [];
                let sheetRows: Record<string, unknown>[] = [];
                let descriptionFromSheet = '';
                let keyFeaturesTextFromSheet = '';
                if (sheetRes && sheetRes.ok) {
                    const sheetText = await sheetRes.text();
                    const payload = safeParseJson(sheetText);
                    const rows = extractRows(payload);
                    sheetRows = rows.map((row) => normalizeRow(row));
                    const currentRepo = `${owner}/${repo}`.toLowerCase();
                    const matched = sheetRows
                        .find((row: Record<string, unknown>) => {
                            const repoValue = row.githubrepo ?? row.repo ?? row.repourl ?? row.repository ?? row.repositoryurl;
                            return normalizeRepoFromInput(repoValue) === currentRepo;
                        });

                    descriptionFromSheet = String(matched?.description || '').trim();
                    keyFeaturesTextFromSheet = String((matched?.keyfeatures ?? matched?.keyfeature ?? matched?.features) || '').trim();
                }

                const nextStats: GithubStats = {
                    stargazers_count: repoData.stargazers_count,
                    forks_count: repoData.forks_count,
                    subscribers_count: repoData.subscribers_count || repoData.watchers_count,
                    open_issues_count: repoData.open_issues_count,
                    language: repoData.language,
                    updated_at: repoData.updated_at,
                    html_url: repoData.html_url
                };

                const languageEntries = Object.entries(languageData as Record<string, number>);
                const totalBytes = languageEntries.reduce((acc, [, value]) => acc + value, 0);
                const techStack: TechStackItem[] = languageEntries
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, value]) => ({
                        name,
                        percentage: totalBytes > 0 ? Math.round((value / totalBytes) * 100) : 0,
                        color: LANGUAGE_COLOR_MAP[name] || '#9ca3af'
                    }));

                const statusTechMeta: StatusTechItem[] = techStack.slice(0, 2).map((tech) => ({
                    name: tech.name,
                    detail: `${tech.percentage}%`,
                    color: tech.color,
                }));

                const contributorList: Contributor[] = (Array.isArray(contributorsData) ? contributorsData : [])
                    .slice(0, 5)
                    .map((item, index: number) => {
                        const contributor = asRecord(item);
                        const login = String(contributor.login || 'unknown');
                        const initials = login
                            .split(/[\W_]+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((x: string) => x[0]?.toUpperCase() || '')
                            .join('') || login.slice(0, 2).toUpperCase();
                        return {
                            name: login,
                            initials,
                            color: CONTRIBUTOR_COLOR_PALETTE[index % CONTRIBUTOR_COLOR_PALETTE.length],
                            contributions: Number(contributor.contributions || 0),
                        };
                    });

                let rankedMoreProjects = readMoreProjectsCache();
                if (!rankedMoreProjects) {
                    const approvedRepos = Array.from(
                        new Set(
                            sheetRows
                                .filter((row) => isApproved(row.approve))
                                .map((row) => normalizeRepoFromInput(
                                    row.githubrepo ?? row.repo ?? row.repourl ?? row.repository ?? row.repositoryurl
                                ))
                                .filter(Boolean)
                        )
                    );

                    const repoStats = await Promise.all(
                        approvedRepos.map(async (fullRepo) => {
                            try {
                                const response = await fetch(`https://api.github.com/repos/${fullRepo}`, { headers });
                                if (!response.ok) return null;
                                const data = await response.json();
                                return {
                                    name: data?.name || fullRepo.split('/')[1] || fullRepo,
                                    stars: Number(data?.stargazers_count || 0),
                                    tech: data?.language || 'Code',
                                    icon: '🧩',
                                    repo: fullRepo,
                                } as MoreProject;
                            } catch {
                                return null;
                            }
                        })
                    );

                    rankedMoreProjects = repoStats
                        .filter((item): item is MoreProject => Boolean(item))
                        .sort((a, b) => b.stars - a.stars);
                    writeMoreProjectsCache(rankedMoreProjects);
                }

                const moreProjects = (rankedMoreProjects || []).slice(0, 3);

                const topics: string[] = Array.isArray(repoData?.topics) ? repoData.topics : [];
                const contributionProgress: ContributionItem[] = (Array.isArray(commitsData) ? commitsData : [])
                    .slice(0, 5)
                    .map((item, index: number) => {
                        const commitItem = asRecord(item);
                        const author = asRecord(commitItem.author);
                        const commit = asRecord(commitItem.commit);
                        const commitAuthor = asRecord(commit.author);
                        const login = String(author.login || commitAuthor.name || 'unknown');
                        const initials = login
                            .split(/[\W_]+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((x: string) => x[0]?.toUpperCase() || '')
                            .join('') || login.slice(0, 2).toUpperCase();
                        const message = String(commit.message || '').split('\n')[0] || 'Commit update';
                        const date = new Date(String(commitAuthor.date || Date.now())).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        });
                        return {
                            step: index + 1,
                            initials,
                            name: login,
                            description: message,
                            date,
                            tag: String(commitItem.sha || '').slice(0, 7) || 'commit',
                            commitUrl: String(commitItem.html_url || `https://github.com/${owner}/${repo}/commits`),
                        };
                    });

                const nextDetailData: DetailPageData = {
                    projectName: repoData?.name || repo,
                    author: repoData?.owner?.login || owner,
                    tags: [...new Set([...topics, ...techStack.map(t => t.name)])].slice(0, 6),
                    description: descriptionFromSheet,
                    techStack,
                    metaTags: topics.slice(0, 8),
                    keyFeaturesText: keyFeaturesTextFromSheet,
                    statusTechMeta,
                    contributors: contributorList,
                    licenseName: repoData?.license?.name || 'No license',
                    licenseDescription: repoData?.license?.spdx_id
                        ? `SPDX: ${repoData.license.spdx_id}`
                        : 'License information from GitHub metadata.',
                    moreProjects,
                    contributionProgress,
                };

                setStats(nextStats);
                setDetailData(nextDetailData);
                writeCache(nextStats, nextDetailData);
            } catch (error) {
                console.error('Error fetching project details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGithubDetails();
    }, [owner, repo]);

    const formatNumber = (num?: number) => {
        if (num === undefined) return '0';
        return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    const sheetDescription = (detailData?.description || '').trim();

    if (loading) {
        return <div className="ai-project-detail-loading">Loading project details...</div>;
    }

    return (
        <div className="ai-project-detail-page">
            <div className="ai-project-hero-wrapper">
                <img src={heroImage} alt={repo} className="ai-project-hero-image" />
            </div>

            <div className="ai-project-content-container">
                {/* Header Row */}
                <div className="ai-project-header-row">
                    <div className="ai-project-titles">
                        <h1 className="ai-project-title">
                            {detailData?.projectName || repo}
                        </h1>
                        <div className="ai-project-author">
                            by <span className="author-name">{detailData?.author || owner}</span>
                        </div>
                        
                        <div className="ai-project-tags">
                            {(detailData?.tags || []).map((tag, idx) => (
                                <span key={idx} className="ai-project-tag-pill">{tag}</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="ai-project-actions">
                        <a 
                            href={stats?.html_url || `https://github.com/${owner}/${repo}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="github-action-button"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="github-icon">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            View on GitHub
                        </a>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="ai-project-status-bar">
                    <div className="detail-status-left-group">
                        <div className="detail-status-item">
                            <svg className="detail-status-icon detail-star-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span className="detail-status-value">{formatNumber(stats?.stargazers_count)}</span>
                            <span className="detail-status-label">Stars</span>
                        </div>

                        <div className="detail-status-item">
                            <svg className="detail-status-icon fork-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="6" y1="3" x2="6" y2="15"></line>
                                <circle cx="18" cy="6" r="3"></circle>
                                <circle cx="6" cy="18" r="3"></circle>
                                <path d="M18 9a9 9 0 0 1-9 9"></path>
                            </svg>
                            <span className="detail-status-value">{formatNumber(stats?.forks_count)}</span>
                            <span className="detail-status-label">Forks</span>
                        </div>

                        <div className="detail-status-item">
                            <svg className="detail-status-icon watch-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span className="detail-status-value">{formatNumber(stats?.subscribers_count)}</span>
                            <span className="detail-status-label">Watchers</span>
                        </div>

                        {(detailData?.statusTechMeta || []).map((tech) => (
                            <div className="detail-status-item tech-meta-item" key={tech.name}>
                                <span className="detail-language-dot" style={{ backgroundColor: tech.color }}></span>
                                <span className="detail-status-value">{tech.name}</span>
                                <span className="detail-status-separator">·</span>
                                <span className="detail-status-label detail-description-label">{tech.detail}</span>
                            </div>
                        ))}
                    </div>

                    <div className="detail-status-item detail-updated-item">
                        <svg className="detail-status-icon time-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span className="detail-status-label">Updated</span>
                        <span className="detail-status-value detail-time-value">{formatDate(stats?.updated_at) || 'Mar 2026'}</span>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="ai-project-main-layout">
                    {/* Left Column: Description & Screenshots */}
                    <div className="ai-project-left-col">
                        <section className="detail-section">
                            <h4 className="detail-section-label">PROJECT DESCRIPTION</h4>
                            <h2 className="detail-main-title">{detailData?.projectName || repo}</h2>
                            <div className="detail-description-text">
                                {sheetDescription
                                    ? sheetDescription.split('\n').map((para, i) => <p key={i}>{para}</p>)
                                    : <p>Please fill `Description` in Google Sheet.</p>}
                            </div>
                        </section>

                        <section className="detail-section key-features-section">
                            <h4 className="detail-section-label">KEY FEATURES</h4>
                            <div className="key-features-paragraph">
                                {detailData?.keyFeaturesText?.trim() || 'Please fill `Key Features` in Google Sheet.'}
                            </div>
                        </section>

                        <section className="detail-section contribution-section">
                            <h4 className="detail-section-label">CONTRIBUTION PROGRESS</h4>
                            <div className="contribution-timeline">
                                {(detailData?.contributionProgress || []).map((item, idx, arr) => (
                                    <div key={`${item.step}-${item.tag}`} className="timeline-row done">
                                        <div className="timeline-left">
                                            <div className="timeline-step done">
                                                ✓
                                            </div>
                                            {idx < arr.length - 1 && <div className="timeline-line" />}
                                        </div>

                                        <div className="timeline-main">
                                            <div className="timeline-header">
                                                <span className="timeline-avatar">{item.initials}</span>
                                                <span className="timeline-name">{item.name}</span>
                                            </div>
                                            <p className="timeline-description">{item.description}</p>
                                        </div>
                                        <div className="timeline-meta">
                                            <div className="timeline-date">{item.date}</div>
                                            <a className="timeline-tag blue" href={item.commitUrl} target="_blank" rel="noreferrer">
                                                {item.tag}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                {(detailData?.contributionProgress || []).length === 0 && (
                                    <div className="timeline-open-card">
                                        <h5>No commits yet</h5>
                                        <p>Commit activity will appear here once the repository has contribution history.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="ai-project-sidebar">
                        <div className="sidebar-widget">
                            <h4 className="widget-title">REPOSITORY STATS</h4>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <span className="stat-card-value">{formatNumber(stats?.stargazers_count)}</span>
                                    <div className="stat-card-label">
                                        <span className="star-dot">⭐</span> Stars
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-card-value">{formatNumber(stats?.forks_count)}</span>
                                    <div className="stat-card-label">
                                        <span className="fork-icon-small">ψ</span> Forks
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-card-value">{stats?.open_issues_count || 0}</span>
                                    <div className="stat-card-label">
                                        <span className="issue-icon-small">⚙️</span> Issues
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-widget">
                            <h4 className="widget-title">TECH STACK</h4>
                            <div className="tech-stack-list">
                                {(detailData?.techStack || []).map((tech, i) => (
                                    <div key={i} className="tech-stack-item">
                                        <div className="tech-info">
                                            <span className="tech-dot" style={{ backgroundColor: tech.color }}></span>
                                            <span className="tech-name">{tech.name}</span>
                                        </div>
                                        <div className="tech-progress-bg">
                                            <div
                                                className="tech-progress-fill"
                                                style={{ width: `${tech.percentage}%`, backgroundColor: tech.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="meta-tags-cloud">
                                {(detailData?.metaTags || []).map((tag, i) => (
                                    <span key={i} className="meta-tag-outline">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-widget">
                            <h4 className="widget-title">CONTRIBUTORS</h4>
                            <div className="contributors-list">
                                {(detailData?.contributors || []).map((c, i) => (
                                    <div key={i} className="contributor-item">
                                        <div className="contributor-avatar" style={{ backgroundColor: c.color }}>
                                            {c.initials}
                                        </div>
                                        <div className="contributor-info">
                                            <div className="contributor-name">{c.name}</div>
                                            <div className="contributor-role-desc">
                                                {c.contributions} contributions
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sidebar-widget">
                            <h4 className="widget-title">LICENSE</h4>
                            <div className="license-card">
                                <div className="license-icon">⚖️</div>
                                <div className="license-content">
                                    <div className="license-name">{detailData?.licenseName || 'No license'}</div>
                                    <div className="license-description">{detailData?.licenseDescription || 'License information from GitHub metadata.'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-widget">
                            <h4 className="widget-title">MORE AI EXPERIMENT PROJECTS</h4>
                            <div className="more-projects-list">
                                {(detailData?.moreProjects || []).map((project) => (
                                    <Link key={project.repo} to={`/ai-project/${project.repo}`} className="more-project-card">
                                        <div className="more-project-icon">{project.icon}</div>
                                        <div className="more-project-content">
                                            <div className="more-project-name">{project.name}</div>
                                            <div className="more-project-meta">
                                                <span className="more-project-star">⭐ {project.stars}</span>
                                                <span>· {project.tech}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                <Link to="/city-zero" className="ai-project-back-cityzero-btn ai-project-back-cityzero-btn-bottom">
                    ← Back to City Zero
                </Link>
            </div>
        </div>
    );
};

export default AiProjectDetailPage;
