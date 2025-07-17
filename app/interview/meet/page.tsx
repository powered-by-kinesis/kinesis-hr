import dynamic from 'next/dynamic';

const InterviewMeetClient = dynamic(() => import('./interview-meet-client'));

type SearchParams = Promise<{ token?: string }>;
export default async function Page(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const token = searchParams.token;
    return <InterviewMeetClient token={token} />;
}
