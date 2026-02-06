export interface IncomingMessage {
    from: string;
    text: string;
    type: 'text' | 'audio' | 'button_reply' | 'unknown';
    audioUrl?: string;
    timestamp: string;
}

export interface OutgoingMessage {
    to: string;
    text?: string;
    type: 'text' | 'image' | 'document' | 'audio' | 'video';
    url?: string; // For media
    caption?: string;
}

export interface RuleResult {
    matched: boolean;
    response?: OutgoingMessage | OutgoingMessage[];
    action?: 'ASK_LOCATION' | 'SET_FLOW_STATE';
}
