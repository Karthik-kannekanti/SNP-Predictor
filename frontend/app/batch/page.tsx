"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, UploadCloud, CheckCircle2, FileText } from 'lucide-react';

export default function BatchAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [jobStatus, setJobStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
    const [jobId, setJobId] = useState<str | null>(null);

    const mockResults = [
        { variant: "BRCA1:c.181T>G", prob: "82%", class: "Pathogenic", ci: "[0.72, 0.92]" },
        { variant: "TP53:c.742C>T", prob: "95%", class: "Pathogenic", ci: "[0.89, 0.98]" },
        { variant: "APOE:c.388T>C", prob: "12%", class: "Benign", ci: "[0.05, 0.20]" },
        { variant: "PTEN:c.388C>T", prob: "91%", class: "Pathogenic", ci: "[0.85, 0.96]" },
        { variant: "MYC:c.135C>A", prob: "45%", class: "Benign (VUS)", ci: "[0.32, 0.58]" },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const startUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        setJobStatus('idle');
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/api/v1/predict-batch`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setJobId(data.job_id);
            setIsUploading(false);
            setJobStatus('processing');

            // Simulate backend processing progress
            let p = 0;
            const interval = setInterval(() => {
                p += 10;
                setProgress(p);
                if (p >= 100) {
                    clearInterval(interval);
                    setJobStatus('completed');
                }
            }, 500);

        } catch (error) {
            console.error(error);
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Batch Analysis</h1>
                <p className="text-slate-500 mt-2">Upload a VCF file (max 10MB) to process multiple variants simultaneously using asynchronous job queues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload VCF</CardTitle>
                            <CardDescription>Select a variant call format file</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={startUpload} className="space-y-6">
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 text-center hover:bg-slate-100 transition-colors">
                                    <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                                    <Label htmlFor="vcf-upload" className="text-sm font-medium text-primary cursor-pointer hover:underline">
                                        Browse Files
                                    </Label>
                                    <Input
                                        id="vcf-upload"
                                        type="file"
                                        accept=".vcf,.vcf.gz"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        {file ? file.name : "or drag and drop here"}
                                    </p>
                                </div>

                                <Button type="submit" className="w-full" disabled={!file || isUploading || jobStatus === 'processing'}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Start Batch Processing"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {jobStatus !== 'idle' && (
                        <Card className="border-blue-100 bg-blue-50/50">
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-slate-700">Job: {jobId}</span>
                                    {jobStatus === 'processing' ? (
                                        <span className="text-blue-600 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1" /> Processing</span>
                                    ) : (
                                        <span className="text-green-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</span>
                                    )}
                                </div>
                                <Progress value={progress} className="h-2" />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-slate-500" />
                                Results Queue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {jobStatus === 'idle' ? (
                                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-lg text-slate-400 p-8 text-center">
                                    <p>Upload a file to see your batch analysis queued up here. Jobs are processed asynchronously using Redis and will populate in real-time.</p>
                                </div>
                            ) : jobStatus === 'processing' ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((skeleton) => (
                                        <div key={skeleton} className="h-12 bg-slate-100 animate-pulse rounded-md" />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-md border overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-medium text-slate-700">Variant ID</th>
                                                <th className="px-4 py-3 font-medium text-slate-700">Pathogenicity</th>
                                                <th className="px-4 py-3 font-medium text-slate-700">Probability</th>
                                                <th className="px-4 py-3 font-medium text-slate-700">95% CI</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-slate-600">
                                            {mockResults.map((result, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-900">{result.variant}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.class.includes('Pathogenic') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                            {result.class}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{result.prob}</td>
                                                    <td className="px-4 py-3 text-slate-500">{result.ci}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
