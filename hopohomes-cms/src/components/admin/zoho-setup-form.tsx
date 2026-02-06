"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, RefreshCw, ChevronRight } from "lucide-react";
import {
    saveZohoConfig,
    syncPropertiesToZoho,
    getZohoApplications,
    getZohoForms,
    getZohoReports,
    getZohoFormFields
} from "@/actions/zoho-actions";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface ZohoConfig {
    owner_name: string;
    app_name: string;
    form_name: string;
    report_name: string;
    field_mapping: Record<string, string>;
    auto_sync: boolean;
    last_synced_at: string | null;
}

interface ZohoApp {
    application_name: string;
    link_name: string;
    workspace_name?: string;
    application_owner?: string;
    owner_name?: string;
    created_time?: string;
}

interface ZohoForm {
    display_name: string;
    link_name: string;
}

interface ZohoReport {
    display_name: string;
    link_name: string;
}

interface ZohoField {
    display_name: string;
    link_name: string;
    type: string;
}

interface ZohoSetupFormProps {
    initialConfig: ZohoConfig | null;
    isConnected: boolean;
}

// CMS Property fields that can be mapped
const CMS_FIELDS = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
    { key: "location", label: "Location" },
    { key: "bedrooms", label: "Bedrooms" },
    { key: "bathrooms", label: "Bathrooms" },
    { key: "area", label: "Area (sq ft)" },
    { key: "property_type", label: "Property Type" },
    { key: "status", label: "Status" },
];

export function ZohoSetupForm({ initialConfig, isConnected }: ZohoSetupFormProps) {
    const { data: session } = useSession();
    const adminId = session?.user?.id;

    const [config, setConfig] = useState<ZohoConfig>({
        owner_name: initialConfig?.owner_name || "",
        app_name: initialConfig?.app_name || "",
        form_name: initialConfig?.form_name || "",
        report_name: initialConfig?.report_name || "",
        field_mapping: initialConfig?.field_mapping || {},
        auto_sync: initialConfig?.auto_sync || false,
        last_synced_at: initialConfig?.last_synced_at || null,
    });

    const [applications, setApplications] = useState<ZohoApp[]>([]);
    const [forms, setForms] = useState<ZohoForm[]>([]);
    const [reports, setReports] = useState<ZohoReport[]>([]);
    const [formFields, setFormFields] = useState<ZohoField[]>([]);

    const [loadingApps, setLoadingApps] = useState(false);
    const [loadingForms, setLoadingForms] = useState(false);
    const [loadingFields, setLoadingFields] = useState(false);
    const [saving, setSaving] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Load applications on mount
    useEffect(() => {
        if (isConnected) {
            loadApplications();
        }
    }, [isConnected]);

    // Load forms when app changes
    useEffect(() => {
        if (config.owner_name && config.app_name) {
            loadFormsAndReports(config.owner_name, config.app_name);
        }
    }, [config.owner_name, config.app_name]);

    const loadApplications = async () => {
        if (!adminId) {
            toast.error("Session expired. Please log in again.");
            return;
        }

        setLoadingApps(true);
        try {
            const result = await getZohoApplications(adminId);
            if (result.success && 'applications' in result && result.applications) {
                setApplications(result.applications);
                // If we have an initial app, move to step 2
                if (initialConfig?.app_name) {
                    setStep(2);
                }
            } else {
                toast.error(result.error || "Failed to load applications");
            }
        } catch (error) {
            toast.error("Failed to load applications");
        } finally {
            setLoadingApps(false);
        }
    };

    const loadFormsAndReports = async (ownerName: string, appLinkName: string) => {
        if (!adminId) {
            toast.error("Session expired. Please log in again.");
            return;
        }

        setLoadingForms(true);
        try {
            const [formsResult, reportsResult] = await Promise.all([
                getZohoForms(ownerName, appLinkName, adminId),
                getZohoReports(ownerName, appLinkName, adminId)
            ]);

            if (formsResult.success && 'forms' in formsResult && formsResult.forms) {
                setForms(formsResult.forms);
            }
            if (reportsResult.success && 'reports' in reportsResult && reportsResult.reports) {
                setReports(reportsResult.reports);
            }
        } catch (error) {
            toast.error("Failed to load forms and reports");
        } finally {
            setLoadingForms(false);
        }
    };

    // Load fields when form changes
    useEffect(() => {
        if (config.owner_name && config.app_name && config.form_name) {
            loadFormFields(config.owner_name, config.app_name, config.form_name);
        }
    }, [config.owner_name, config.app_name, config.form_name]);

    const loadFormFields = async (ownerName: string, appLinkName: string, formLinkName: string) => {
        if (!adminId) {
            toast.error("Session expired. Please log in again.");
            return;
        }

        setLoadingFields(true);
        try {
            const result = await getZohoFormFields(ownerName, appLinkName, formLinkName, adminId);
            if (result.success && 'fields' in result && result.fields) {
                setFormFields(result.fields as ZohoField[]);
            }
        } catch (error) {
            toast.error("Failed to load form fields");
        } finally {
            setLoadingFields(false);
        }
    };

    const handleAppSelect = (appLinkName: string) => {
        const app = applications.find(a => a.link_name === appLinkName);
        if (app) {
            console.log("Selected App:", app);
            // Prioritize owner_name or workspace_name over application_owner
            const ownerName = app.owner_name || app.workspace_name || app.application_owner;

            if (!ownerName) {
                console.warn("Could not determine owner name for app:", app);
                toast.error("Could not determine owner name for this application");
                return;
            }

            setConfig(prev => ({
                ...prev,
                app_name: appLinkName,
                owner_name: ownerName,
                form_name: "",
                report_name: ""
            }));
            setStep(2);
        }
    };

    const handleSave = async () => {
        if (!adminId) {
            toast.error("Session expired. Please log in again.");
            return;
        }

        if (!config.app_name) {
            toast.error("Please select an application");
            return;
        }

        setSaving(true);
        try {
            const result = await saveZohoConfig({
                owner_name: config.owner_name,
                app_name: config.app_name,
                form_name: config.form_name,
                report_name: config.report_name,
                field_mapping: config.field_mapping,
                auto_sync: config.auto_sync,
            }, adminId);

            if (result.success) {
                toast.success("Configuration saved successfully");
                setStep(3);
            } else {
                toast.error(result.error || "Failed to save configuration");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const handleSync = async () => {
        if (!adminId) {
            toast.error("Session expired. Please log in again.");
            return;
        }

        setSyncing(true);
        try {
            const result = await syncPropertiesToZoho(adminId);

            if (result.success) {
                toast.success(`Synced ${result.count || 0} properties to Zoho Creator`);
                setConfig(prev => ({ ...prev, last_synced_at: new Date().toISOString() }));
            } else {
                toast.error(result.error || "Failed to sync properties");
            }
        } catch (error) {
            toast.error("An error occurred while syncing");
        } finally {
            setSyncing(false);
        }
    };

    const updateFieldMapping = (cmsField: string, zohoField: string) => {
        setConfig(prev => ({
            ...prev,
            field_mapping: {
                ...prev.field_mapping,
                [cmsField]: zohoField,
            },
        }));
    };

    if (!isConnected) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">
                        Please connect your Zoho account first from the Integrations page.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Step 1: Select Application */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                        Select Application
                    </CardTitle>
                    <CardDescription>
                        Choose the Zoho Creator application to sync with
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingApps ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading applications...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Select
                                value={config.app_name}
                                onValueChange={handleAppSelect}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an application" />
                                </SelectTrigger>
                                <SelectContent>
                                    {applications.map((app) => (
                                        <SelectItem key={app.link_name} value={app.link_name}>
                                            {app.application_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {applications.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No applications found. Make sure you have applications in Zoho Creator.
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Step 2: Select Form & Report */}
            {step >= 2 && config.app_name && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                            Configure Forms & Reports
                        </CardTitle>
                        <CardDescription>
                            Select which form to add records and which report to read from
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingForms ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading forms and reports...
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Form (for adding records)</Label>
                                    <Select
                                        value={config.form_name}
                                        onValueChange={(val) => setConfig(prev => ({ ...prev, form_name: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a form" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {forms.map((form) => (
                                                <SelectItem key={form.link_name} value={form.link_name}>
                                                    {form.display_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Report (for reading/updating)</Label>
                                    <Select
                                        value={config.report_name}
                                        onValueChange={(val) => setConfig(prev => ({ ...prev, report_name: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a report" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {reports.map((report) => (
                                                <SelectItem key={report.link_name} value={report.link_name}>
                                                    {report.display_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Field Mapping & Sync */}
            {step >= 2 && config.form_name && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                                Field Mapping
                            </CardTitle>
                            <CardDescription>
                                Map CMS property fields to Zoho Creator fields
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {CMS_FIELDS.map((field) => (
                                    <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                                        <Label className="text-sm font-medium">{field.label}</Label>
                                        {loadingFields ? (
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Loading...
                                            </div>
                                        ) : (
                                            <Select
                                                value={config.field_mapping[field.key] || ""}
                                                onValueChange={(val) => updateFieldMapping(field.key, val === "none" ? "" : val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Zoho field" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {formFields.map((zohoField) => (
                                                        <SelectItem key={zohoField.link_name} value={zohoField.link_name}>
                                                            {zohoField.display_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sync Controls</CardTitle>
                            <CardDescription>
                                Manage data synchronization
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Auto Sync</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Automatically sync when properties are updated
                                    </p>
                                </div>
                                <Switch
                                    checked={config.auto_sync}
                                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, auto_sync: checked }))}
                                />
                            </div>

                            {config.last_synced_at && (
                                <p className="text-sm text-muted-foreground">
                                    Last synced: {new Date(config.last_synced_at).toLocaleString()}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Configuration
                                </Button>
                                <Button onClick={handleSync} variant="outline" disabled={syncing || !config.app_name}>
                                    {syncing ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    Sync Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
