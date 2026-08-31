interface DonationsAlerts {
    data: {
        id: number;
        name: string;
        username: string;
        message: string;
        message_type: string;
        amount: number;
        currency: string;
        is_shown: number;
        created_at: string;
        shown_at: string | null;
        amount_in_user_currency?: number;
    }[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    }
}

export default DonationsAlerts;
