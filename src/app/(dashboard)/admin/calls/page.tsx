import { getCallInquiries, getActiveCampaigns } from '@/lib/data'
import CallInquiriesClient from './CallInquiriesClient'
import { PageHeader } from '@/components/shared/PageHeader'

export default async function AdminCallsPage() {
    const inquiries = await getCallInquiries()
    const campaigns = await getActiveCampaigns()

    return (
        <div className="space-y-10">
            <PageHeader
                title="Call Telemetry"
                subtitle="Aggregated customer ingress across global market hubs."
                breadcrumbs={['Management', 'Call Inquiries']}
            />
            <CallInquiriesClient
                initialInquiries={inquiries}
                campaigns={campaigns}
            />
        </div>
    )
}
