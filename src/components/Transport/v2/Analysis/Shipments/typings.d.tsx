import moment from "moment";

export type AnalysisReq = {
    begin_date?: moment.Moment;
    end_date?: moment.Moment;
    app_id?: string;
    carrier?: string | number;
    provider?: number;
}