"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function ResultsDashboard({ data }: { data: any }) {
    const isPathogenic = data.classification === "Pathogenic";
    const probPercent = (data.probability * 100).toFixed(1);
    const color = isPathogenic ? "text-red-600" : "text-green-600";
    const bgProgressColor = isPathogenic ? "bg-red-600" : "bg-green-600";

    const chartData = data.shap_explanation?.features.map((f: any) => ({
        name: f.feature,
        value: f.importance,
        fill: f.importance > 0 ? '#ef4444' : '#3b82f6' // red if pushing to pathogenic, blue if benign
    }));

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="shadow-md border-slate-200 overflow-hidden">
                <div className={`h-2 w-full ${isPathogenic ? 'bg-red-500' : 'bg-green-500'}`} />
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Classification Result ({data.variant_id})</p>
                            <h2 className={`text-4xl font-bold ${color} flex items-center`}>
                                {data.classification}
                                {isPathogenic ? <AlertTriangle className="ml-3 h-8 w-8" /> : <CheckCircle className="ml-3 h-8 w-8" />}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-500 mb-1">Pathogenicity Probability</p>
                            <p className="text-3xl font-semibold text-slate-800">{probPercent}%</p>
                            <p className="text-xs text-slate-400 mt-1">95% CI: [{data.confidence_interval[0].toFixed(2)}, {data.confidence_interval[1].toFixed(2)}]</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                            <span>0% (Benign)</span>
                            <span>100% (Pathogenic)</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${bgProgressColor} transition-all duration-1000 ease-out`}
                                style={{ width: `${probPercent}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm border-slate-200 flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-lg">SHAP Feature Importance</CardTitle>
                        <CardDescription>Top 5 features affecting this prediction</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(val: number) => val.toFixed(4)} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {chartData?.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-lg">Model Explanation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                            <p className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-900 font-medium">
                                {data.shap_explanation?.summary_text}
                            </p>
                            {data.structural_impact && (
                                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                                    <h4 className="font-semibold text-amber-900 mb-1">Structural Prediction</h4>
                                    <p className="text-amber-800">{data.structural_impact}</p>
                                </div>
                            )}
                            {data.warning_flags && data.warning_flags.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-slate-800 mb-2">Quality Warnings:</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                        {data.warning_flags.map((flag: str, i: number) => (
                                            <li key={i}>{flag}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
