package com.crm.crmservice.common.constant;

/**
 * 公共字段名，此处做抽离，优化代码
 * 全局常量
 */

import java.util.Arrays;
import java.util.List;

/**
 * 全局常量 定义
 */
public interface CommonField {

    //字段名为 items 分页结果集名称
    String ITEMS = "items";

    //字段名为 total 分页结果集总数名称
    String TOTAL = "total";

    //字段名为 pageSize 分页结果集页数名称
    String PAGE_SIZE = "pageSize";


    String YEAR = "year";

    String QUARTER = "quarter";

    // 开始时间
    String START_TIME = "start_time";

    //结束时间
    String END_TIME = "end_time";

    // 操作成功
    String OPERATE_SUCCESSFULLY = "operate successfully.";

    // 操作失败
    String OPERATION_FAILURE = "operation failure.";


    String ADD_FAILURE = "Adding a failure";

    String NOT_DATA = "The data does not exist";

    String NOT_MOULD_NAME = "The template name does not exist";
    String HAVE_MOULD_NAME = "The template name already exist";

    String DATA_DEFICIENCY = "Missing template name or template data";

    String PARAMETER_IS_NULL = "Parameter is null";

    //数据缺失
    String DATA_MISSING = "DATA MISSING";

    String RELEASE_PROCESS_SUCCESSFUL = "RELEASE PROCESS SUCCESSFUL";

    String PROHIBIT_DOUBLE_SUBMISSION = "Prohibit double submission";

    String TITLE = "title";

    String TITLE_CODE = "titleCode";

    String UPLOAD_FILES = "Please select upload file";
    String UPLOAD_SUCCESSFUL = "upload successful";
    String INCOMING_DATA = "Incoming data is null";
    String UPLOAD_FAILED = "Upload failed.Please check the uploaded file";
    String MODIFY_SUCCESSFULLY = "Modify successfully";
    String DELETE_THE_STATE = "The data is in the deleted state";
    public static final String TYPE_EMPTY = "type cannot be empty.";
    public static final String STATUS = "status";


    List<String> PRPreparation_EXCEL_TITLE_LIST = Arrays.asList("Request No.", "DP Req No.#", "Institution", "Project", "LP", "Req Issue Date", "FY", "Status", "PR Code",
            "PR Issue Date", "Invoice", "Received Date", "Total Exp.", "BackBone", "Income", "Start Installation", "End Installation", "Resp staff");
    List<String> PRPreparation_EXCEL_TITLE_LIST_SHEET2 = Arrays.asList("Request No.", "Institution", "Contract", "Item No.", "Description", "Unit Price", "Qty", "PR Code");
    List<String> PRPreparation_EXCEL_TITLE_LIST_SHEET3 = Arrays.asList("Contract", "Item No.", "Description", "Unit Price", "Qty");

    List<String> PRPOSummary_EXCEL_TITLE_LIST = Arrays.asList("FisYr", "PR Date", "PR Code", "PR No", "LPool", "PR Sent", "PO No", "PO Sent", "Final Amt", "Contract No."
            , "Requester's team", "PR Requester", "Vendor Code", "COA", "Project", "Remarks");

    List<String> FundingTransfer_EXCEL_TITLE_LIST = Arrays.asList("Fund Party", "Total Income", "Description", "COA");

    String EXCEL_NAME = "ExportExcel.xlsx";


}
