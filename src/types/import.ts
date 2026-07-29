export interface MetaAdsCSVRow {
    Date?: string
    'Campaign Name'?: string
    'Campaign ID'?: string
    'Delivery Status'?: string
    'Delivery Level'?: string
    'Result Type'?: string
    Results?: string
    'Cost Per Result'?: string
    'Amount Spent (USD)'?: string
    'Amount Spent'?: string
    Impressions?: string
    Reach?: string
    'Attribution Setting'?: string
    'Quality Ranking'?: string
    'Engagement Rate Ranking'?: string
    'Conversion Rate Ranking'?: string
    'Ad Set Name'?: string
    'Link Clicks'?: string
    'CPC (Cost Per Link Click)'?: string
    'CPM (Cost Per 1,000 Impressions)'?: string
    Frequency?: string
    'Clicks (All)'?: string
    'CPC (All)'?: string
    'Reporting Starts'?: string
    'Reporting Ends'?: string
    Budget?: string
    // Allow for any other fields
    [key: string]: string | undefined
}

export interface ImportResult {
    success: boolean
    rowsImported: number
    rowsSkipped: number
    errors: string[]
}
