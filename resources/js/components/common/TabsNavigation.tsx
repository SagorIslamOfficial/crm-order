import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
    value: string;
    label: string;
    hidden?: boolean;
}

interface TabsNavigationProps {
    tabs: Tab[];
    className?: string;
}

export function TabsNavigation({ tabs, className = '' }: TabsNavigationProps) {
    const visibleTabs = tabs.filter((tab) => !tab.hidden);

    return (
        <TabsList className={className}>
            {visibleTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                </TabsTrigger>
            ))}
        </TabsList>
    );
}
