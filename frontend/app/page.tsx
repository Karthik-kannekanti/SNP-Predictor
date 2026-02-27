"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import ResultsDashboard from '@/components/ResultsDashboard';

export default function Home() {
    const [gene, setGene] = useState('BRCA1');
    const [cdna, setCdna] = useState('c.181T>G');
    const [protein, setProtein] = useState('p.Cys61Gly');

    const mutation = useMutation({
        mutationFn: async (newVariant: any) => {
            const response = await fetch('http://localhost:8000/api/v1/predict-single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVariant),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        },
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ gene, cdna_change: cdna, protein_change: protein });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="bg-white border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-800">Single Variant Inference</CardTitle>
                        <CardDescription>Enter variant details to predict pathogenicity.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gene">Gene Symbol</Label>
                                <Input id="gene" value={gene} onChange={(e) => setGene(e.target.value)} required placeholder="e.g. TP53" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cdna">cDNA Change</Label>
                                <Input id="cdna" value={cdna} onChange={(e) => setCdna(e.target.value)} required placeholder="e.g. c.181T>G" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="protein">Protein Change</Label>
                                <Input id="protein" value={protein} onChange={(e) => setProtein(e.target.value)} required placeholder="e.g. p.Cys61Gly" />
                            </div>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Analyze Variant
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 bg-blue-50/50">
                    <CardContent className="p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">VCF Batch Upload</span> represents the full automated workflow. Submit up to 10MB of variants for background job processing.
                            <div className="mt-3">
                                <Button variant="outline" className="w-full bg-white text-blue-700 hover:text-blue-800 border-blue-200" onClick={() => alert("Batch workflow simulated!")}>
                                    Go to Batch Upload
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                {mutation.isPending && (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Evaluating feature extraction layer...</p>
                    </div>
                )}

                {mutation.isError && (
                    <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md flex items-start">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        <p>An error occurred determining pathogenicity. Check if backend is running.</p>
                    </div>
                )}

                {mutation.isSuccess && mutation.data && (
                    <ResultsDashboard data={mutation.data} />
                )}

                {!mutation.isPending && !mutation.isSuccess && !mutation.isError && (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm border-dashed">
                        <p>Submit a variant to view explainable AI predictions here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
