interface Response {
    model: string;
    answer: string;
}

interface ResponsesProps {
    responses: Response[];
}

export default function Responses({ responses }: ResponsesProps) {
    const removeThinkTags = (text: string) => {
        return text.replace(/<think>[\s\S]*?<\/think>/g, '');
    };

    if (responses.length === 0) {
        return (
            <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Responses</h2>
                <p className="text-gray-400 italic">No responses yet. Submit a query to see results.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                    AI Responses
                    <span className="ml-2 text-sm font-medium text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                        {responses.length} {responses.length === 1 ? 'result' : 'results'}
                    </span>
                </h2>
                <div className="text-xs text-gray-400">
                    {new Date().toLocaleString()}
                </div>
            </div>

            <div className="space-y-5">
                {responses.map((resp, index) => (
                    <div
                        key={`${resp.model}-${index}`}
                        className="bg-gradient-to-br from-gray-700/80 to-gray-800/90 p-5 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 shadow-md"
                    >
                        <div className="flex items-start gap-3">
                            <div className="min-w-[40px]">
                                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-mono font-bold text-blue-400 text-lg">
                                        {resp.model}
                                    </h3>
                                    <span className="text-xs text-gray-400 bg-gray-900/50 px-2 py-1 rounded-full">
                                        {resp.model.includes('llama') ? 'Meta' :
                                            resp.model.includes('qwen') ? 'Alibaba' :
                                                resp.model.includes('deepseek-r1-distill') ? 'DeepSeek' :
                                                    resp.model.includes('gemma') ? 'Google' : 'AI Model'}
                                    </span>
                                </div>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                        {removeThinkTags(resp.answer)}
                                    </p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-end">
                                    <span className="text-xs text-gray-400">
                                        {removeThinkTags(resp.answer).length} characters • {Math.ceil(removeThinkTags(resp.answer).split(' ').length / 200)} min read
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700/30 text-center text-sm text-gray-400">
                End of responses • {new Date().getFullYear()} AI Chat Interface
            </div>
        </div>
    );
}