import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { Team, User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    team = null,
}: {
    user: User;
    showEmail?: boolean;
    team?: Team | null;
}) {
    const getInitials = useInitials();
    const showAvatar = Boolean(user.avatar && user.avatar !== '');

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-lg">
                {showAvatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="rounded-lg text-black dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {user.is_admin ? (
                    <span className="truncate text-xs font-semibold text-[#8b9060]">
                        Administrator
                    </span>
                ) : (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
