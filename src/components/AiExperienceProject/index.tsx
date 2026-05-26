import React, { useCallback, useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import SubmitProjectModal from './SubmitProjectModal';
import './AiExperienceProject.css';
import { useLanguage } from "../../context/useLanguage";

interface ProjectItem {
    title: string;
    description: string;
    imageSrc: string;
    tags: string[];
    githubRepo: string;
    starCount?: number;
}

type JsonRecord = Record<string, unknown>;

const AI_EXPERIENCE_IMAGE_POOL = [
    "/AI EXPERIENCE PROJECT/Ninja Labs CN-banner-2-2.jpg",
    "/AI EXPERIENCE PROJECT/Ninja Labs CN-banner-2-1.png",
    "/AI EXPERIENCE PROJECT/Star-Office-UI-INJ.png",
];
const PROJECTS_CACHE_KEY = 'ai_experience_projects_cache_v1';
const PROJECTS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const AiExperienceProject: React.FC = () => {
    const { language } = useLanguage();
    const isZh = language === "zh";
    const translate = useCallback((zh: string, en: string) => (isZh ? zh : en), [isZh]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSteps, setShowSteps] = useState(false);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [projectsMessage, setProjectsMessage] = useState('');

    useEffect(() => {
        const sheetApiUrl = import.meta.env.VITE_GOOGLE_SHEET_API;

        const readProjectsCache = (): ProjectItem[] | null => {
            try {
                const raw = localStorage.getItem(PROJECTS_CACHE_KEY);
                if (!raw) return null;
                const parsed = JSON.parse(raw) as { timestamp: number; projects: ProjectItem[] };
                if (!parsed?.timestamp || !Array.isArray(parsed?.projects)) return null;
                if (Date.now() - parsed.timestamp > PROJECTS_CACHE_TTL_MS) return null;
                return parsed.projects;
            } catch {
                return null;
            }
        };

        const writeProjectsCache = (nextProjects: ProjectItem[]) => {
            try {
                localStorage.setItem(
                    PROJECTS_CACHE_KEY,
                    JSON.stringify({ timestamp: Date.now(), projects: nextProjects })
                );
            } catch {
                // ignore cache write errors
            }
        };

        const cachedProjects = readProjectsCache();
        if (cachedProjects && cachedProjects.length > 0) {
            setProjects(cachedProjects);
            setIsLoadingProjects(false);
            return;
        }

        if (!sheetApiUrl) {
            setProjects([]);
            setProjectsMessage(translate('未配置 VITE_GOOGLE_SHEET_API。', 'VITE_GOOGLE_SHEET_API is not configured.'));
            setIsLoadingProjects(false);
            return;
        }

        const isRecord = (value: unknown): value is JsonRecord =>
            typeof value === 'object' && value !== null;
        const asRecord = (value: unknown): JsonRecord =>
            (isRecord(value) ? value : {});
        const asRecordArray = (value: unknown): JsonRecord[] =>
            Array.isArray(value) ? value.filter(isRecord) : [];

        const normalizeGithubRepo = (value: unknown): string => {
            const raw = String(value || '').trim();
            if (!raw) return '';

            if (raw.includes('github.com/')) {
                try {
                    const url = new URL(raw);
                    const [owner, repo] = url.pathname.replace(/^\/+/, '').split('/');
                    if (owner && repo) return `${owner}/${repo.replace(/\.git$/, '')}`;
                } catch {
                    return '';
                }
            }

            const [owner, repo] = raw.split('/');
            return owner && repo ? `${owner}/${repo.replace(/\.git$/, '')}` : '';
        };

        const normalizeRow = (row: Record<string, unknown>): Record<string, unknown> => {
            return Object.entries(row || {}).reduce((acc, [key, value]) => {
                const normalizedKey = key.toLowerCase().replace(/[\s_-]/g, '');
                acc[normalizedKey] = value;
                return acc;
            }, {} as Record<string, unknown>);
        };

        const parseTags = (value: unknown): string[] => {
            if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean).slice(0, 6);
            return String(value || '')
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)
                .slice(0, 6);
        };

        const safeParseJson = (text: string): unknown => {
            try {
                return JSON.parse(text);
            } catch {
                // Support Google Visualization response:
                // google.visualization.Query.setResponse({...});
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

            // Google Visualization table format
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

        const isApproved = (value: unknown): boolean => {
            const v = String(value ?? '').trim().toLowerCase();
            return ['yes', 'y', 'true', '1', 'approved'].includes(v);
        };

        const pickStableImageByRepo = (githubRepo: string): string => {
            if (!githubRepo) return AI_EXPERIENCE_IMAGE_POOL[0];
            let hash = 0;
            for (let i = 0; i < githubRepo.length; i++) {
                hash = (hash << 5) - hash + githubRepo.charCodeAt(i);
                hash |= 0;
            }
            const index = Math.abs(hash) % AI_EXPERIENCE_IMAGE_POOL.length;
            return AI_EXPERIENCE_IMAGE_POOL[index];
        };

        const toProjectItem = (row: JsonRecord): ProjectItem | null => {
            const normalized = normalizeRow(row);

            const approveValue = normalized.approve;
            if (approveValue !== undefined && !isApproved(approveValue)) {
                return null;
            }

            const githubRepo = normalizeGithubRepo(
                normalized.githubrepo ??
                normalized.repo ??
                normalized.repourl ??
                normalized.repository ??
                normalized.repositoryurl
            );
            const title = String(normalized.title || normalized.projectname || githubRepo.split('/')[1] || '').trim();
            const description = String(normalized.description || '').trim();
            const imageSrc = pickStableImageByRepo(githubRepo);
            const tags = parseTags(normalized.tags ?? normalized.techtags ?? normalized.techstack ?? normalized.techstacktags);

            if (!githubRepo || !title) return null;

            return {
                title,
                description: description || translate('来自 City Zero 贡献者的 AI 体验项目。', 'AI experience project from City Zero contributors.'),
                imageSrc,
                tags: tags.length ? tags : [translate('AI', 'AI'), translate('开源', 'Open Source')],
                githubRepo
            };
        };

        const fetchProjects = async () => {
            try {
                const response = await fetch(sheetApiUrl, { method: 'GET' });
                if (!response.ok) throw new Error(`Google Sheet API error: ${response.status}`);

                const rawText = await response.text();
                const payload = safeParseJson(rawText);
                const rows = extractRows(payload);
                const parsedProjects = rows.map(toProjectItem).filter(Boolean) as ProjectItem[];

                const githubToken = import.meta.env.VITE_GITHUB_API_KEY;
                const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
                if (githubToken) {
                    headers['Authorization'] = `Bearer ${githubToken}`;
                }

                const projectsWithStars = await Promise.all(
                    parsedProjects.map(async (project) => {
                        try {
                            const statRes = await fetch(`https://api.github.com/repos/${project.githubRepo}`, { headers });
                            if (!statRes.ok) {
                                return { ...project, starCount: -1 };
                            }
                            const statData = await statRes.json();
                            return { ...project, starCount: Number(statData?.stargazers_count ?? -1) };
                        } catch {
                            return { ...project, starCount: -1 };
                        }
                    })
                );

                projectsWithStars.sort((a, b) => {
                    const starDiff = (b.starCount ?? -1) - (a.starCount ?? -1);
                    if (starDiff !== 0) return starDiff;
                    return a.title.localeCompare(b.title);
                });

                setProjects(projectsWithStars);
                writeProjectsCache(projectsWithStars);
                if (!parsedProjects.length) {
                    setProjectsMessage(translate('Google Sheet 暂无已审核通过的项目。', 'No approved projects found in Google Sheet yet.'));
                }
            } catch (error) {
                console.error('Failed to load AI projects from Google Sheet:', error);
                setProjects([]);
                setProjectsMessage(translate('从 Google Sheet 加载项目失败。', 'Failed to load projects from Google Sheet.'));
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchProjects();
    }, [translate]);

    return (
        <section className="ai-experience-section reveal">
            <div className="ai-experience-container">
                <p className="section-kicker ai-experience-kicker">{translate("社区贡献", "COMMUNITY BUILDS")}</p>
                <h2 className="ai-experience-title">{translate("AI 体验项目", "AI Experiment Projects")}</h2>

                {/* Banner */}
                <div className="contribution-banner">
                    <div className="banner-left">
                        <div className="rocket-icon">🚀</div>
                        <div className="banner-text">
                            <h3>{translate("开放贡献中 — 提交你的 AI 项目", "Open for contributions — submit your AI project")}</h3>
                            <p>{translate("Fork、构建并向 City Zero 社区分享你的作品", "Fork, build, and share your work with the City Zero community")}</p>
                        </div>
                    </div>
                    <div className="banner-right">
                        <button className="banner-btn secondary-btn" onClick={() => setShowSteps(!showSteps)}>
                            {showSteps ? translate('收起指南', 'Hide guide') : translate('如何参与', 'How to participate')}
                        </button>
                        <button className="banner-btn primary-btn" onClick={() => setIsModalOpen(true)}>{translate('提交项目', 'Submit project')} →</button>
                    </div>
                </div>

                {/* Steps Navigation */}
                {showSteps && (
                    <div className="steps-navigation">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-label">{translate('Fork 基础仓库', 'Fork the base repo')}</div>
                        </div>
                        <div className="step-divider">&gt;</div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-label">{translate('构建你的项目', 'Build your repo')}</div>
                        </div>
                        <div className="step-divider">&gt;</div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-label">{translate('提交 PR', 'Submit the PR')}</div>
                        </div>
                        <div className="step-divider">&gt;</div>
                        <div className="step-item">
                            <div className="step-number">4</div>
                            <div className="step-label">{translate('审核通过并展示', 'Get featured')}</div>
                        </div>
                    </div>
                )}

                {/* Project Grid */}
                <div className="project-grid">
                    {projects.map((project, idx) => (
                        <ProjectCard key={idx} {...project} />
                    ))}

                    {!isLoadingProjects && projects.length === 0 && (
                        <div className="projects-empty-state">
                            {projectsMessage || translate('暂无可展示项目。', 'No projects available.')}
                        </div>
                    )}

                    {/* Submit New Card (Dashed Border) */}
                    <div className="submit-new-card" onClick={() => setIsModalOpen(true)}>
                        <div className="submit-icon-circle">
                            <span className="plus-icon">+</span>
                        </div>
                        <h3 className="submit-title">{translate('提交你的项目', 'Submit your project')}</h3>
                        <div className="submit-tag">{translate('开放贡献中', 'Open for contributors')}</div>
                    </div>
                </div>
            </div>

            <SubmitProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </section>
    );
};

export default AiExperienceProject;
