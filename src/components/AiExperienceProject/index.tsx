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

interface AiExperienceProjectProps {
    /** full = kicker+banner+grid (原样); showcase = 仅项目网格; submit = 仅接入流程 */
    mode?: "full" | "showcase" | "submit";
}

const AI_EXPERIENCE_IMAGE_POOL = [
    "/AI EXPERIENCE PROJECT/Ninja Labs CN-banner-2-2.jpg",
    "/AI EXPERIENCE PROJECT/Ninja Labs CN-banner-2-1.png",
    "/AI EXPERIENCE PROJECT/Star-Office-UI-INJ.png",
];

/* 内置种子项目 · 与线上 n1nj4.fun/city-zero 展示一致。
   Google Sheet 未配置或拉取失败时直接展示;配置后与 Sheet 数据按 repo 去重合并。 */
const SEED_PROJECTS: ProjectItem[] = [
    {
        title: "NinjaNFTFrontend",
        description: "500 unique cyberpunk ninjas are descending upon the N1NJ4 City Zero. City Zero is initiated by Ninja Labs and co-built by the community.",
        imageSrc: "/AI EXPERIENCE PROJECT/Ninja Labs CN-banner-2-1.png",
        tags: ["React", "TypeScript"],
        githubRepo: "Ninja-Labs-Devs/NinjaNFTFrontend",
    },
    {
        title: "Star-Office-UI-INJ",
        description: "A pixel-art styled office dashboard for visualizing AI agent work status in real-time, with Injective EVM wallet integration via MetaMask.",
        imageSrc: "/AI EXPERIENCE PROJECT/Star-Office-UI-INJ.png",
        tags: ["Python", "React"],
        githubRepo: "Ninja-Labs-Devs/Star-Office-UI-INJ",
    },
];
const PROJECTS_CACHE_KEY = 'ai_experience_projects_cache_v1';
const PROJECTS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const AiExperienceProject: React.FC<AiExperienceProjectProps> = ({ mode = "full" }) => {
    const { language } = useLanguage();
    const isZh = language === "zh";
    const translate = useCallback((zh: string, en: string) => (isZh ? zh : en), [isZh]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSteps, setShowSteps] = useState(false);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [projectsMessage, setProjectsMessage] = useState('');

    useEffect(() => {
        // submit 模式不展示网格,无需拉取数据
        if (mode === "submit") {
            setIsLoadingProjects(false);
            return;
        }
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
            // 未配置 Sheet API:直接展示内置种子项目
            setProjects(SEED_PROJECTS);
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

                // 合并内置种子项目 (按 repo 去重, Sheet 数据优先)
                for (const seed of SEED_PROJECTS) {
                    if (!parsedProjects.some(p => p.githubRepo === seed.githubRepo)) {
                        parsedProjects.push(seed);
                    }
                }

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
                // 拉取失败:退回内置种子项目
                setProjects(SEED_PROJECTS);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchProjects();
    }, [translate, mode]);

    return (
        <section className="ai-experience-section reveal">
            <div className="ai-experience-container">
                {mode === "full" && (
                    <>
                        <p className="section-kicker ai-experience-kicker">{translate("社区贡献", "COMMUNITY BUILDS")}</p>
                        <h2 className="ai-experience-title">{translate("AI 体验项目", "AI Experiment Projects")}</h2>
                    </>
                )}

                {/* Banner · 接入引导 (showcase 模式隐藏 · full/submit 显示) */}
                {mode !== "showcase" && (
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
                )}

                {/* Steps Navigation */}
                {showSteps && mode !== "showcase" && (
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

                {/* Project Grid · showcase 模式按性质分两栏: 社区项目 / 官方仓库 */}
                {mode === "showcase" && (() => {
                    const isOfficialRepo = (p: ProjectItem) =>
                        p.githubRepo.toLowerCase().startsWith("ninja-labs-devs/");
                    const communityProjects = projects.filter((p) => !isOfficialRepo(p));
                    const officialRepos = projects.filter(isOfficialRepo);
                    return (
                        <>
                            {/* 社区项目 (Sheet 来源) · 不带自己的标题, 视觉上归入上方 COMMUNITY PROJECTS 栏 */}
                            {communityProjects.length > 0 && (
                                <div className="project-group">
                                    <div className="project-grid">
                                        {communityProjects.map((project) => (
                                            <ProjectCard key={project.githubRepo} {...project} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {officialRepos.length > 0 && (
                                <div className="project-group">
                                    {/* 标题样式与上方 COMMUNITY PROJECTS (city-tasks-kicker) 同款 */}
                                    <p className="section-kicker project-group-kicker">{translate("官方仓库", "REPOS")}</p>
                                    <div className="project-grid">
                                        {officialRepos.map((project) => (
                                            <ProjectCard key={project.githubRepo} {...project} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!isLoadingProjects && projects.length === 0 && (
                                <div className="projects-empty-state">
                                    {projectsMessage || translate('暂无可展示项目。', 'No projects available.')}
                                </div>
                            )}
                        </>
                    );
                })()}

                {/* Project Grid · full 模式保留原平铺网格 */}
                {mode === "full" && (
                <div className="project-grid">
                    {projects.map((project, idx) => (
                        <ProjectCard key={idx} {...project} />
                    ))}

                    {!isLoadingProjects && projects.length === 0 && (
                        <div className="projects-empty-state">
                            {projectsMessage || translate('暂无可展示项目。', 'No projects available.')}
                        </div>
                    )}

                    {/* Submit New Card · 仅 full 模式 (接入入口已独立成章节) */}
                    <div className="submit-new-card" onClick={() => setIsModalOpen(true)}>
                        <div className="submit-icon-circle">
                            <span className="plus-icon">+</span>
                        </div>
                        <h3 className="submit-title">{translate('提交你的项目', 'Submit your project')}</h3>
                        <div className="submit-tag">{translate('开放贡献中', 'Open for contributors')}</div>
                    </div>
                </div>
                )}
            </div>

            <SubmitProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </section>
    );
};

export default AiExperienceProject;
