import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const hasHeader = Boolean(title || description);

    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 sm:px-6">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    {hasHeader && (
                        <div className="space-y-2 text-center">
                            {title && (
                                <h1 className="text-xl font-medium">{title}</h1>
                            )}
                            {description && (
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
