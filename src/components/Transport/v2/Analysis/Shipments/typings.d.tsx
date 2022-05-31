import moment from "moment";

export type AnalysisReq = {
    start_at?: moment.Moment;
    end_at?: moment.Moment;
    app_id?: string;
    carrier?: string | number;
}