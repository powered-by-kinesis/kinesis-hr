"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/organisms/site-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { jobPostRepository } from "@/repositories";

interface JobFormData {
    title: string;
    description: string;
    location: string;
    employmentType: string;
    status: string;
}

interface EditJobPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<JobFormData>({
        title: "",
        description: "",
        location: "",
        employmentType: "Full-Time",
        status: "Open",
    });

    const [currentTab, setCurrentTab] = useState('job-information');
    const unwrappedParams = use(params);

    useEffect(() => {
        const fetchJobPost = async () => {
            try {
                const jobPost = await jobPostRepository.getJobPostById(parseInt(unwrappedParams.id));
                setFormData({
                    title: jobPost.title,
                    description: jobPost.description,
                    location: jobPost.location || "",
                    employmentType: jobPost.employmentType,
                    status: jobPost.status,
                });
            } catch (error) {
                console.error("Error fetching job post:", error);
                toast.error("Failed to load job post data");
                router.push("/hiring"); // Redirect back on error
            }
        };

        fetchJobPost();
    }, [unwrappedParams, router]);

    // Navigation items for the left sidebar
    const navItems = {
        "job-information": {
            label: "Job Information",
        },
        "ai-interviewer": {
            label: "AI Interviewer",
        },
    }

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement job update logic
        console.log("Form submitted:", formData);
    };

    // Handle form field changes
    const handleChange = (field: keyof JobFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': 'calc(var(--spacing) * 72)',
                        '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset className="md:peer-data-[variant=inset]:m-0">
                    <SiteHeader />
                    {/* Main Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="container mx-auto py-8 px-4">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-2xl font-bold">
                                    Edit Job Opening
                                </h1>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="text-blue-600"
                                >
                                    Cancel
                                </Button>
                            </div>

                            {/* Navigation Sidebar */}
                            <div className="flex gap-8">
                                <div className="w-64">
                                    <nav className="space-y-2">
                                        {Object.entries(navItems).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className={`flex items-center p-3 rounded-lg cursor-pointer ${key === currentTab
                                                    ? "bg-blue-600 text-white"
                                                    : "text-white hover:bg-blue-600"
                                                    }`}
                                                onClick={() => handleTabChange(key)}
                                            >
                                                {value.label}
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                                {currentTab === "job-information" && (
                                    <>
                                        <div className="flex-1">
                                            <Card className="p-6">
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h2 className="text-xl font-semibold mb-6">Job Information</h2>

                                                        {/* Title */}
                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium">
                                                                Job Title<span className="text-red-500">*</span>
                                                            </label>
                                                            <Input
                                                                value={formData.title}
                                                                onChange={(e) => handleChange("title", e.target.value)}
                                                                placeholder="Software Engineer"
                                                                required
                                                            />
                                                        </div>

                                                        {/* Description */}
                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium">
                                                                Description<span className="text-red-500">*</span>
                                                            </label>
                                                            <textarea
                                                                className="w-full min-h-[100px] p-2 border rounded-md"
                                                                value={formData.description}
                                                                onChange={(e) => handleChange("description", e.target.value)}
                                                                placeholder="Enter job description"
                                                                required
                                                            />
                                                        </div>

                                                        {/* Location */}
                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium">
                                                                Location
                                                            </label>
                                                            <Input
                                                                value={formData.location}
                                                                onChange={(e) => handleChange("location", e.target.value)}
                                                                placeholder="e.g. New York, NY"
                                                            />
                                                        </div>

                                                        {/* Employment Type */}
                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium">
                                                                Employment Type<span className="text-red-500">*</span>
                                                            </label>
                                                            <RadioGroup defaultValue="option-one">
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="option-one" id="option-one" />
                                                                    <Label htmlFor="option-one">Full-Time</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="option-two" id="option-two" />
                                                                    <Label htmlFor="option-two">Part-Time</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="option-three" id="option-three" />
                                                                    <Label htmlFor="option-three">Contract</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="option-four" id="option-four" />
                                                                    <Label htmlFor="option-four">Internship</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </div>

                                                        {/* Status */}
                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium">
                                                                Status<span className="text-red-500">*</span>
                                                            </label>
                                                            <RadioGroup defaultValue="option-one">
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="option-one" id="option-one" />
                                                                    <Label htmlFor="option-one">Open</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="option-two" id="option-two" />
                                                                    <Label htmlFor="option-two">Closed</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </div>
                                                    </div>

                                                    {/* Save Button */}
                                                    <div className="pt-6">
                                                        <Button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                                                            Save Job
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Card>
                                        </div>
                                    </>
                                )}
                                {currentTab === "ai-interviewer" && (
                                    <>
                                        <div className="flex-1">
                                            <Card className="p-6">
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    <div className="space-y-4">
                                                        <h2 className="text-2xl font-semibold mb-6">AI Interviewer</h2>

                                                        {/* Title */}
                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium">
                                                                What kind of AI interviewer do you want?<span className="text-red-500">*</span>
                                                            </label>
                                                            <Input
                                                                value={formData.title}
                                                                onChange={(e) => handleChange("title", e.target.value)}
                                                                placeholder="As a senior software engineer, you will be asked to..."
                                                                required
                                                            />
                                                        </div>

                                                        {/* Description */}
                                                        <div className="space-y-2">
                                                            <label className="block text-sm font-medium">
                                                                Interview Description<span className="text-red-500">*</span>
                                                            </label>
                                                            <textarea
                                                                className="w-full min-h-[100px] p-2 border rounded-md "
                                                                value={formData.description}
                                                                onChange={(e) => handleChange("description", e.target.value)}
                                                                placeholder="The AI interviewer will ask you questions based on the job description and your experience."
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Save Button */}
                                                    <div className="pt-6">
                                                        <Button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                                                            Save AI Interviewer
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Card>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div >
    );
}