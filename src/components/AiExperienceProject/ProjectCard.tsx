import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

interface ProjectCardProps {
    title: string;
    description: string;
    imageSrc: string;
    tags: string[];
    githubRepo: string; // e.g., "Ninja-Labs-Devs/Star-Office-UI-INJ"
}

const REPO_STATS_CACHE_PREFIX = 'ai_repo_stats_cache_v1:';
const REPO_STATS_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageSrc, tags, githubRepo }) => {
    const [stars, setStars] = useState<number | string>('...');
    const [forks, setForks] = useState<number | string>('...');

    const formatNumber = (num: number) => {
        return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
    };

    useEffect(() => {
        const cacheKey = `${REPO_STATS_CACHE_PREFIX}${githubRepo}`;

        const readStatsCache = (): { stars: number; forks: number } | null => {
            try {
                const raw = localStorage.getItem(cacheKey);
                if (!raw) return null;
                const parsed = JSON.parse(raw) as { timestamp: number; stars: number; forks: number };
                if (!parsed?.timestamp) return null;
                if (Date.now() - parsed.timestamp > REPO_STATS_CACHE_TTL_MS) return null;
                if (typeof parsed.stars !== 'number' || typeof parsed.forks !== 'number') return null;
                return { stars: parsed.stars, forks: parsed.forks };
            } catch {
                return null;
            }
        };

        const writeStatsCache = (next: { stars: number; forks: number }) => {
            try {
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), ...next }));
            } catch {
                // ignore cache write errors
            }
        };

        const fetchGithubStats = async () => {
            if (!githubRepo) return;
            try {
                // Get Token from Vite ENV
                const githubToken = import.meta.env.VITE_GITHUB_API_KEY;
                
                const headers: HeadersInit = {
                    'Accept': 'application/vnd.github+json'
                };
                
                if (githubToken) {
                    headers['Authorization'] = `Bearer ${githubToken}`;
                }

                const response = await fetch(`https://api.github.com/repos/${githubRepo}`, { headers });
                if (!response.ok) {
                    throw new Error(`Failed to fetch from GitHub: ${response.status}`);
                }
                const data = await response.json();
                setStars(formatNumber(data.stargazers_count));
                setForks(formatNumber(data.forks_count));
                writeStatsCache({ stars: data.stargazers_count, forks: data.forks_count });
            } catch (error) {
                console.error('Error fetching GitHub stats:', error);
                setStars('-');
                setForks('-');
            }
        };

        const cached = readStatsCache();
        if (cached) {
            setStars(formatNumber(cached.stars));
            setForks(formatNumber(cached.forks));
            return;
        }

        fetchGithubStats();
    }, [githubRepo]);

    return (
        <Link
            to={`/ai-project/${githubRepo}`}
            state={{ imageSrc }}
            className="ai-project-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <div className="ai-project-image-container">
                <img src={imageSrc} alt={title} className="ai-project-image" />
            </div>
            <div className="ai-project-content">
                <h3 className="ai-project-card-title">{title}</h3>
                <p className="ai-project-desc">{description}</p>

                <div className="ai-project-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="ai-project-tag">{tag}</span>
                    ))}
                </div>

                <div className="ai-project-stats">
                    <div className="stat-item">
                        <svg className="stat-icon star-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
                        </svg>
                        <span>{stars}</span>
                    </div>
                    <div className="stat-item">
                        <svg className="stat-icon fork-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                        </svg>
                        <span>{forks}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
