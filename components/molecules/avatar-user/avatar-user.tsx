import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarUserProps {
  avatar: string | React.ReactNode;
  name: string;
}

export function AvatarUser({ avatar, name = 'User' }: AvatarUserProps) {
  return (
    <Avatar>
      {typeof avatar === 'string' ? (
        <>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </>
      ) : (
        <AvatarFallback>{avatar}</AvatarFallback>
      )}
    </Avatar>
  );
}
