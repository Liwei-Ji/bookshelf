import React, { useState } from 'react';
import { KnowledgeSummary } from '../types';
import { X, ChevronDown, ChevronRight, BookOpen, Zap, FileText, Headphones, Presentation, Video } from 'lucide-react';

interface KnowledgePanelProps {
    bookTitle: string;
    summary: KnowledgeSummary;
    onClose: () => void;
}

// Accordion section component
const Section: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <span className="text-slate-400 dark:text-slate-500">{icon}</span>
                <span className="flex-1 font-medium text-slate-800 dark:text-slate-200 text-sm">{title}</span>
                {isOpen
                    ? <ChevronDown size={16} className="text-slate-400" />
                    : <ChevronRight size={16} className="text-slate-400" />
                }
            </button>
            {isOpen && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {children}
                </div>
            )}
        </div>
    );
};

export const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ bookTitle, summary, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'insights' | 'media'>('insights');

    // Fade in
    React.useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    // Escape key handler
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const hasInsights = summary.part1_overview || summary.part5_eightyTwenty || summary.part6_onePager;
    const hasMedia = summary.resources && summary.resources.length > 0;
    const baseUrl = import.meta.env.BASE_URL;

    return (
        <div
            className={`fixed inset-0 z-[60] flex flex-col bg-white dark:bg-slate-950 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-950 shrink-0 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
                        <BookOpen size={18} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {bookTitle}
                    </h2>
                </div>
                <button
                    onClick={handleClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shrink-0"
                >
                    <X size={20} strokeWidth={1.5} />
                </button>
            </div>

            {/* Tabs (only show if both insights and media exist) */}
            {hasInsights && hasMedia && (
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeTab === 'insights'
                                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        💡 知識要點
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeTab === 'media'
                                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        🎧 學習資源
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto">

                    {/* Insights Tab */}
                    {(activeTab === 'insights' || !hasMedia) && hasInsights && (
                        <>
                            {/* Part 1: Overview */}
                            {summary.part1_overview && (
                                <Section title="核心概覽" icon={<BookOpen size={16} />} defaultOpen={true}>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                                <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">主題</p>
                                                <p className="text-slate-700 dark:text-slate-300">{summary.part1_overview.topic}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                                <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">目標讀者</p>
                                                <p className="text-slate-700 dark:text-slate-300">{summary.part1_overview.targetAudience}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">核心問題</p>
                                            <p className="text-slate-700 dark:text-slate-300">{summary.part1_overview.coreProblem}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">主要論點</p>
                                            <p className="text-slate-700 dark:text-slate-300">{summary.part1_overview.mainArgument}</p>
                                        </div>
                                    </div>

                                    {/* Key Ideas */}
                                    {summary.part1_overview.keyIdeas.length > 0 && (
                                        <div className="mt-5">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                                核心概念 ({summary.part1_overview.keyIdeas.length})
                                            </p>
                                            <div className="space-y-3">
                                                {summary.part1_overview.keyIdeas.map((idea, i) => (
                                                    <KeyIdeaCard key={i} idea={idea} index={i} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Section>
                            )}

                            {/* Part 5: 80/20 */}
                            {summary.part5_eightyTwenty && (
                                <Section title="80/20 精華" icon={<Zap size={16} />}>
                                    <ol className="space-y-2">
                                        {summary.part5_eightyTwenty.essentialKnowledge.map((point, i) => (
                                            <li key={i} className="flex gap-3 items-start">
                                                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                                                    {i + 1}
                                                </span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </Section>
                            )}

                            {/* Part 6: One-Pager */}
                            {summary.part6_onePager && (
                                <Section title="一頁式摘要" icon={<FileText size={16} />}>
                                    <div className="space-y-4">
                                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                                            <p className="text-[11px] uppercase tracking-wider text-blue-400 dark:text-blue-500 mb-1">核心思想</p>
                                            <p className="text-slate-700 dark:text-slate-300">{summary.part6_onePager.coreIdea}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">關鍵概念</p>
                                                <ul className="space-y-1">
                                                    {summary.part6_onePager.keyConcepts.map((c, i) => (
                                                        <li key={i} className="flex gap-2 items-start">
                                                            <span className="text-blue-400 mt-1.5 shrink-0">•</span>
                                                            <span className="text-xs">{c}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">關鍵原則</p>
                                                <ul className="space-y-1">
                                                    {summary.part6_onePager.keyPrinciples.map((p, i) => (
                                                        <li key={i} className="flex gap-2 items-start">
                                                            <span className="text-emerald-400 mt-1.5 shrink-0">•</span>
                                                            <span className="text-xs">{p}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">實際應用</p>
                                                <ul className="space-y-1">
                                                    {summary.part6_onePager.applications.map((a, i) => (
                                                        <li key={i} className="flex gap-2 items-start">
                                                            <span className="text-violet-400 mt-1.5 shrink-0">•</span>
                                                            <span className="text-xs">{a}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Section>
                            )}
                        </>
                    )}

                    {/* Media Tab */}
                    {(activeTab === 'media' || !hasInsights) && hasMedia && (
                        <div className="p-5 space-y-4">
                            {summary.resources!.map((resource, i) => (
                                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                    {resource.type === 'audio' && resource.url && (
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Headphones size={16} className="text-violet-500" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{resource.label}</span>
                                            </div>
                                            <audio controls className="w-full" preload="metadata">
                                                <source src={`${baseUrl}${resource.url}`} type="audio/mp4" />
                                                您的瀏覽器不支援音訊播放。
                                            </audio>
                                        </div>
                                    )}
                                    {resource.type === 'video' && resource.url && (
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Video size={16} className="text-red-500" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{resource.label}</span>
                                            </div>
                                            <video controls className="w-full rounded-lg" preload="metadata">
                                                <source src={`${baseUrl}${resource.url}`} type="video/mp4" />
                                                您的瀏覽器不支援影片播放。
                                            </video>
                                        </div>
                                    )}
                                    {resource.type === 'slides' && resource.images && (
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Presentation size={16} className="text-orange-500" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{resource.label}</span>
                                            </div>
                                            <div className="space-y-2 max-h-[60vh] overflow-y-auto rounded-lg">
                                                {resource.images.map((img, j) => (
                                                    <img
                                                        key={j}
                                                        src={`${baseUrl}${img}`}
                                                        alt={`${resource.label} - ${j + 1}`}
                                                        className="w-full rounded-md"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!hasInsights && !hasMedia && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
                            <BookOpen size={48} strokeWidth={1.5} className="mb-4" />
                            <p className="text-sm">暫無學習資源</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// Sub-component: collapsible key idea card
const KeyIdeaCard: React.FC<{ idea: { name: string; explanation: string; importance: string; bookExample: string }; index: number }> = ({ idea, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="rounded-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center gap-3 px-4 py-3">
                <span className="shrink-0 w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">{idea.name}</span>
                {expanded
                    ? <ChevronDown size={14} className="text-slate-400 shrink-0" />
                    : <ChevronRight size={14} className="text-slate-400 shrink-0" />
                }
            </div>
            {expanded && (
                <div className="px-4 pb-4 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                    <p><span className="text-slate-400 dark:text-slate-500">解釋：</span>{idea.explanation}</p>
                    <p><span className="text-slate-400 dark:text-slate-500">重要性：</span>{idea.importance}</p>
                    <p><span className="text-slate-400 dark:text-slate-500">書中例子：</span>{idea.bookExample}</p>
                </div>
            )}
        </div>
    );
};
