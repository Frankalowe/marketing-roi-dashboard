import { getMetaAds } from '@/lib/data'
import MetaAdsManagementClient from './MetaAdsManagementClient'
import { PageHeader } from '@/components/shared/PageHeader'
import { Database } from 'lucide-react'

export default async function AdminMetaAdsPage() {
    const ads = await getMetaAds()

    return (
        <div className="space-y-10">
            <PageHeader
                title="Meta Ads Hub"
                subtitle="High-fidelity performance management for Meta Marketing API egress."
                breadcrumbs={['Management', 'Meta Ads']}
            />
            <MetaAdsManagementClient initialAds={ads} />
        </div>
    )
}
