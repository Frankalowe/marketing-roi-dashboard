import { getCallInquiries } from '@/lib/data'
import CallInquiriesClient from './CallInquiriesClient'
import { PageHeader } from '@/components/shared/PageHeader'

export default async function AdminCallsPage() {
    const inquiries = await getCallInquiries()

    return (
        <div className="space-y-10">
            <PageHeader
                title="Call Records"
                subtitle="Track customer inquiries from all channels and locations."
                breadcrumbs={['Management', 'Call Inquiries']}
            />
            <CallInquiriesClient
                initialInquiries={inquiries}
            />
        </div>
    )
}
