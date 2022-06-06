type AnalysisReq = {
    begin_date: moment.Moment;
    end_date: moment.Moment;
    app_id: string;
    carrier: number | string;
    provider: number;
}