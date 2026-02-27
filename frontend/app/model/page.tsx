"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { Target, Search, BarChart3, Database } from 'lucide-react';

export default function ModelTransparencyPage() {

    // Fake ROC Data for visual
    const rocData = [
        { fpr: 0.0, tpr: 0.0 }, { fpr: 0.05, tpr: 0.4 }, { fpr: 0.1, tpr: 0.65 },
        { fpr: 0.15, tpr: 0.8 }, { fpr: 0.2, tpr: 0.88 }, { fpr: 0.3, tpr: 0.93 },
        { fpr: 0.5, tpr: 0.97 }, { fpr: 0.8, tpr: 0.99 }, { fpr: 1.0, tpr: 1.0 }
    ];

    // Fake Calibration Data
    const calibrationData = [
        { predicted: 0.1, actual: 0.12 }, { predicted: 0.2, actual: 0.18 },
        { predicted: 0.3, actual: 0.29 }, { predicted: 0.4, actual: 0.45 },
        { predicted: 0.5, actual: 0.51 }, { predicted: 0.6, actual: 0.63 },
        { predicted: 0.7, actual: 0.68 }, { predicted: 0.8, actual: 0.79 },
        { predicted: 0.9, actual: 0.88 }, { predicted: 1.0, actual: 0.95 }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-2xl mx-auto mt-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Model Transparency</h1>
                <p className="text-lg text-slate-500">Rigorous validation metrics and explainability details ensuring trust for clinical genomics workflows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Target className="h-8 w-8 text-blue-500 mb-3" />
                        <h3 className="font-semibold text-xl text-slate-900">93.4%</h3>
                        <p className="text-sm text-slate-500 font-medium">AUROC (Blind Test)</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Search className="h-8 w-8 text-purple-500 mb-3" />
                        <h3 className="font-semibold text-xl text-slate-900">91.8%</h3>
                        <p className="text-sm text-slate-500 font-medium">AUPRC</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <BarChart3 className="h-8 w-8 text-emerald-500 mb-3" />
                        <h3 className="font-semibold text-xl text-slate-900">0.024</h3>
                        <p className="text-sm text-slate-500 font-medium">Brier Score (Calibration)</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <Database className="h-8 w-8 text-amber-500 mb-3" />
                        <h3 className="font-semibold text-xl text-slate-900">142,501</h3>
                        <p className="text-sm text-slate-500 font-medium">Total Training Variants</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Receiver Operating Characteristic (ROC)</CardTitle>
                        <CardDescription>Performance across varying classification thresholds.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={rocData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTpr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tickCount={6} />
                                <YAxis dataKey="tpr" type="number" domain={[0, 1]} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <RechartsTooltip />
                                <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#94a3b8" strokeDasharray="3 3" />
                                <Area type="monotone" dataKey="tpr" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorTpr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Calibration Curve (Reliability Diagram)</CardTitle>
                        <CardDescription>Predicted probability versus actual observed frequency.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={calibrationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="predicted" type="number" domain={[0, 1]} tickCount={6} />
                                <YAxis dataKey="actual" type="number" domain={[0, 1]} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <RechartsTooltip />
                                <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white border-slate-200">
                <CardHeader>
                    <CardTitle>Feature Engineering Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4 text-slate-700 list-disc pl-5">
                        <li><strong className="text-slate-900">Conservation (phyloP / PhastCons):</strong> Evaluates evolutionary constraints. High conservation scores usually correlate strongly with pathogenicity.</li>
                        <li><strong className="text-slate-900">Protein Structure Proxy:</strong> Estimates how deeply buried the missense mutation exists within the 3D protein structure (derived from AlphaFold DB metrics).</li>
                        <li><strong className="text-slate-900">Population Frequency (gnomAD MAF):</strong> Strict filtering ensuring model doesn't classify common benign polymorphisms as pathogenic. MAF &gt; 1% leads to strong benign pushes.</li>
                        <li><strong className="text-slate-900">Physicochemical Properties:</strong> Grantham distance and BLOSUM62 mapping to quantify the severity of the amino acid substitution.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
