package com.crm.crmservice.service.impl;

import com.crm.crmservice.entity.param.ProcessSendEmailParam;
import com.crm.crmservice.entity.vo.process.crm.sendEmail.CrmProcessAdGroupUserInfo;
import com.crm.crmservice.entity.vo.process.crm.sendEmail.CrmProcessInformationDetail;
import com.crm.crmservice.service.CrmProcessSendEmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CrmProcessSendEmailServiceImpl implements CrmProcessSendEmailService {
    @Override
    public CrmProcessInformationDetail getDetail(String requestNo) {
        return null;
    }

    @Override
    public void sendCrmProcessMailForProd(ProcessSendEmailParam param) {

    }

    @Override
    public CrmProcessAdGroupUserInfo getAdUserDetail(String username) {
        return null;
    }

    @Override
    public void saveEmailErrorLog(Exception e) {

    }

    /*@Autowired
    private DpRequestService requestService;

    @Autowired
    protected EmailSystemService emailSystemService;

    @Autowired
    private CrmProcessSendEmail[] CrmProcessSendEmails;

    @Autowired
    private HospitalNameMapper hospitalNameMapper;

    @Autowired
    private AaaService aaaService;

    @Autowired
    private SitePersonCopyService sitePersonCopyService;

    @Autowired
    private AdController adController;

    @Value("${frontend.url}")
    private String domain;

    @Autowired
    private RequestFormService requestFormService;

    @Autowired
    private StaffCorpMappingMapper staffCorpMappingMapper;

    @Resource
    private EmailErrorLogMapper emailErrorLogMapper;

    @Autowired
    private ThreadPoolTaskExecutor executor;

    private static final ThreadLocal<WeakReference<ProcessSendEmailParam>> PROCESS_SEND_PARAM_THREAD_LOCAL =
            new ThreadLocal<>();

    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();

    @Override
    public CrmProcessInformationDetail getDetail(String requestNo) {
        DpRequest dpRequest = requestService.getRequest(requestNo);
        log.info("request:【{}】", dpRequest);

        // set value to base information
        CrmProcessInformationDetail CrmProcessInformationDetail = detailBaseInfo(requestNo, dpRequest);
        setRequestCancel(requestNo, CrmProcessInformationDetail);

        // set value for NMSResponsibleStaffList
        detailSetNMSResponsibleStaffListPri(dpRequest, CrmProcessInformationDetail);
        detailSetNMSResponsibleStaffListSec(dpRequest, CrmProcessInformationDetail);
        detailSetNMSResponsibleStaffListResp(dpRequest, CrmProcessInformationDetail);

        //set value for company
        detailSetCompany(dpRequest, CrmProcessInformationDetail);

        // set value for request's manager
        detailSetManager(dpRequest, CrmProcessInformationDetail);

        // set value for this request budget holder information
        detailSetBudgetHolder(dpRequest, CrmProcessInformationDetail);

        detailSetPaymentMethod(dpRequest, CrmProcessInformationDetail);

        setEndorsement(dpRequest, CrmProcessInformationDetail);

        return CrmProcessInformationDetail;
    }

    private void setEndorsement(DpRequest dpRequest, CrmProcessInformationDetail CrmProcessInformationDetail) {
        CrmProcessEndorsement CrmProcessEndorsement = new CrmProcessEndorsement();
        CrmProcessEndorsement.setPersonName(StringUtils.revertString(dpRequest.getEndorsementName()));
        CrmProcessEndorsement.setPersonRemark(StringUtils.revertString(dpRequest.getEndorsementRemark()));
        CrmProcessEndorsement.setNetworkRemark(StringUtils.revertString(dpRequest.getExternalNetworkRemark()));
        CrmProcessEndorsement.setStatus(StringUtils.revertString(dpRequest.getEndorsementStatus()));
        CrmProcessEndorsement.setApprovalStatus(StringUtils.revertString(dpRequest.getEndorsementApprovalStatus()));
        if (StringUtils.isNotEmpty(dpRequest.getEndorsementId())) {
            CrmProcessAdGroupUserInfo adUserDetail = this.getAdUserDetail(dpRequest.getEndorsementId());
            CrmProcessEndorsement.setEmail(adUserDetail.getEmail());
        }
        CrmProcessInformationDetail.setProcessEndorsement(CrmProcessEndorsement);
    }

    private void setRequestCancel(String requestNo, CrmProcessInformationDetail CrmProcessInformationDetail) {
        DpRequestDetail requestDetail = requestFormService.getRequestDetail(requestNo);
        if (requestDetail == null) {
            return;
        }
        CrmProcessRequestCancel CrmProcessRequestCancel = new CrmProcessRequestCancel();
        CrmProcessRequestCancel.setRemark(requestDetail.getDpRequestCancelProcessRemark());
        CrmProcessRequestCancel.setReason(StringUtils.revertString(requestDetail.getDpRequestCancelExamineReason()));
        if (StringUtils.isNotEmpty(requestDetail.getDpRequestCancelCorpId())) {
            CrmProcessAdGroupUserInfo requestInfo = this.getAdUserDetail(requestDetail.getDpRequestCancelCorpId());
            String[] displayName = requestInfo.getName().split(",");
            CrmProcessRequestCancel.setRequestName(displayName[0]);
            CrmProcessRequestCancel.setRequestTitle(displayName.length > 1 ? displayName[1] : "");
            CrmProcessRequestCancel.setRequestPhone(requestInfo.getPhone());
            CrmProcessRequestCancel.setRequestEmail(requestInfo.getEmail());
        }
        if (StringUtils.isNotEmpty(requestDetail.getDpRequestCancelExamineCorpId())) {
            CrmProcessAdGroupUserInfo examineInfo =
                    this.getAdUserDetail(requestDetail.getDpRequestCancelExamineCorpId());
            String[] displayName = examineInfo.getName().split(",");
            CrmProcessRequestCancel.setExamineEmail(examineInfo.getEmail());
            CrmProcessRequestCancel.setExamineName(displayName[0]);
            CrmProcessRequestCancel.setRequestTitle(displayName.length > 1 ? displayName[1] : "");
            CrmProcessRequestCancel.setExaminePhone(examineInfo.getPhone());
        }
        CrmProcessInformationDetail.setProcessRequestCancel(CrmProcessRequestCancel);
    }

    private CrmProcessInformationDetail detailBaseInfo(String requestNo, DpRequest dpRequest) {
        CrmProcessInformationDetail CrmProcessInformationDetail = new CrmProcessInformationDetail();
        CrmProcessInformationDetail.setRequestNo(requestNo);
        CrmProcessInformationDetail.setRequesterRemark(StringUtils.revertString(dpRequest.getRequesterremark()));
        CrmProcessInformationDetail.setRequesterTitle(StringUtils.revertString(this.getAdUserDetail(dpRequest.getRequesterid()).getName()));
        CrmProcessInformationDetail.setRequestType(dpRequest.getApptype());
        CrmProcessInformationDetail.setSubmittedName(dpRequest.getRequestername());
        CrmProcessInformationDetail.setHospitalAbbreviation(dpRequest.getServiceathosp());
        CrmProcessInformationDetail.setMni(StringUtils.isNotEmpty(dpRequest.getIsMni()) ? dpRequest.getIsMni() : "N");
        try {
            if (dpRequest.getRequesterid().toLowerCase().contains("sense")) {
                CrmProcessInformationDetail.setRequestMail("sensesc1@ho.ha.org.hk");
            } else {
                CrmProcessInformationDetail.setRequestMail(this.getAdUserDetail(dpRequest.getRequesterid()).getEmail());
            }
        } catch (Exception e) {
            try {
                log.error("request：【{}】", JSON_MAPPER.writeValueAsString(dpRequest));
                this.saveEmailErrorLog(e);
            } catch (Exception ex) {
                log.error("set base error", ex);
            }
        }
        return CrmProcessInformationDetail;
    }

    private void detailSetNMSResponsibleStaffListPri(DpRequest request,
                                                     CrmProcessInformationDetail CrmProcessInformationDetail) {
        ProcessResponsibleStaff responsibleStaff = this.getProcessResponsibleStaff("pri", request.getServiceathosp());
        if (responsibleStaff == null) {
            return;
        }
        List<ProcessResponsibleStaff> processResponsibleStaffList = new ArrayList<>();
        processResponsibleStaffList.add(responsibleStaff);
        CrmProcessInformationDetail.setNMSResponsibleStaffListPri(processResponsibleStaffList);
    }

    private void detailSetNMSResponsibleStaffListSec(DpRequest request,
                                                     CrmProcessInformationDetail CrmProcessInformationDetail) {
        ProcessResponsibleStaff responsibleStaff = this.getProcessResponsibleStaff("sec", request.getServiceathosp());
        if (responsibleStaff == null) {
            return;
        }
        List<ProcessResponsibleStaff> processResponsibleStaffList = new ArrayList<>();
        processResponsibleStaffList.add(responsibleStaff);
        CrmProcessInformationDetail.setNMSResponsibleStaffListSec(processResponsibleStaffList);
    }

    private void detailSetNMSResponsibleStaffListResp(DpRequest request,
                                                      CrmProcessInformationDetail CrmProcessInformationDetail) {
        ProcessResponsibleStaff responsibleStaff = this.getProcessResponsibleStaff("resp", request.getRespStaffCorpId());
        if (responsibleStaff == null) {
            return;
        }
        List<ProcessResponsibleStaff> processResponsibleStaffList = new ArrayList<>();
        processResponsibleStaffList.add(responsibleStaff);
        CrmProcessInformationDetail.setNMSResponsibleStaffListResp(processResponsibleStaffList);
    }

    private ProcessResponsibleStaff getProcessResponsibleStaff(String keyword, String name) {
        ProcessResponsibleStaff responsibleStaff = new ProcessResponsibleStaff();

        if ("resp".equals(keyword)) {
            if (StringUtils.isEmpty(name)) {
                return null;
            }
            CrmProcessAdGroupUserInfo adUserDetail = this.getAdUserDetail(name);
            responsibleStaff.setEmail(adUserDetail.getEmail());
            responsibleStaff.setName(adUserDetail.getName());
            responsibleStaff.setPhone(adUserDetail.getPhone());
        } else {
            QueryWrapper<HospitalName> hospitalNameQueryWrapper = new QueryWrapper<>();
            hospitalNameQueryWrapper.eq("Hospital", name);
            HospitalName hospitalName = hospitalNameMapper.selectOne(hospitalNameQueryWrapper);
            log.info("hospital：【{}】", hospitalName);
            if (hospitalName == null) {
                return null;
            }
            ProcessSendEmailParam processSendEmailParam = PROCESS_SEND_PARAM_THREAD_LOCAL.get().get();
            QueryWrapper<StaffCorpMapping> staffCorpMappingQueryWrapper = new QueryWrapper<>();
            if ("pri".equals(keyword)) {
                staffCorpMappingQueryWrapper.eq("`Staff Name`", hospitalName.getStaffPri());
            } else if ("sec".equals(keyword)) {
                staffCorpMappingQueryWrapper.eq("`Staff Name`", hospitalName.getStaffSec());
            }
            List<StaffCorpMapping> staffCorpMappings = staffCorpMappingMapper.selectList(staffCorpMappingQueryWrapper);
            if (CollectionUtils.isEmpty(staffCorpMappings)) {
                throw new CustomException("not exist staff corp mapping");
            }
            StaffCorpMapping staffCorpMapping = staffCorpMappings.get(0);
            CrmProcessAdGroupUserInfo adUserDetail = this.getAdUserDetail(staffCorpMapping.getCorpId());
            responsibleStaff.setName(adUserDetail.getName());
            responsibleStaff.setEmail(adUserDetail.getEmail());
            responsibleStaff.setPhone(adUserDetail.getPhone());
        }
        return responsibleStaff;
    }

    *//**
     * if send email information include staff
     *
     * @param prodNo
     * @return if include staff return true . else return false;
     *//*
    private boolean inStaffList(String prodNo) {
        ArrayList<String> staffProdNoList = new ArrayList<>();
        staffProdNoList.add("Prod2");
        staffProdNoList.add("Prod3");
        staffProdNoList.add("Prod4");
        staffProdNoList.add("Prod5");
        staffProdNoList.add("Prod6");
        staffProdNoList.add("Prod7");
        staffProdNoList.add("Prod16");
        staffProdNoList.add("Prod17");
        staffProdNoList.add("Prod18");
        staffProdNoList.add("Prod20");
        staffProdNoList.add("Prod21");
        staffProdNoList.add("Prod28");
        staffProdNoList.add("Prod30");
        staffProdNoList.add("Prod31");
        for (String staffProdNo : staffProdNoList) {
            if (prodNo.equals(staffProdNo)) {
                return true;
            }
        }
        return false;
    }

    private void detailSetCompany(DpRequest dpRequest, CrmProcessInformationDetail CrmProcessInformationDetail) {
        CrmProcessCompany CrmProcessCompany = new CrmProcessCompany();
        CrmProcessCompany.setAddress(dpRequest.getExtbillcompanyadd());
        CrmProcessCompany.setName(dpRequest.getExtbillcompanyname());
        CrmProcessCompany.setPerson(dpRequest.getExtbillcontactname());
        CrmProcessCompany.setPhone(dpRequest.getExtbillcontactphone());
        CrmProcessInformationDetail.setProcessCompany(CrmProcessCompany);
    }

    private void detailSetManager(DpRequest dpRequest, CrmProcessInformationDetail CrmProcessInformationDetail) {
        CrmProcessManager CrmProcessManager = new CrmProcessManager();
        if (StringUtils.isNotEmpty(dpRequest.getRmanagerid())) {
            CrmProcessAdGroupUserInfo adUserDetail = this.getAdUserDetail(dpRequest.getRmanagerid());
            CrmProcessManager.setEmail(adUserDetail.getEmail());
            CrmProcessManager.setPhone(adUserDetail.getPhone());
            CrmProcessManager.setName(adUserDetail.getName());
            CrmProcessManager.setRemark(StringUtils.revertString(dpRequest.getRmanagerremark()));
        } else {
            CrmProcessAdGroupUserInfo adUserDetail = this.getAdUserDetail(dpRequest.getRequesterid());
            CrmProcessManager.setEmail(adUserDetail.getEmail());
            CrmProcessManager.setName(adUserDetail.getName().split(",")[0]);
            CrmProcessManager.setPhone(StringUtils.revertString(dpRequest.getRequesterphone()));
            CrmProcessManager.setRemark(StringUtils.revertString(dpRequest.getRequesterremark()));
        }

        CrmProcessInformationDetail.setProcessManager(CrmProcessManager);
    }

    private void detailSetBudgetHolder(DpRequest dpRequest, CrmProcessInformationDetail CrmProcessInformationDetail) {
        if (StringUtils.isNotEmpty(dpRequest.getBudgetholderid())) {
            CrmProcessAdGroupUserInfo adUserDetail = this.getAdUserDetail(dpRequest.getBudgetholderid());
            CrmProcessBudgetHolder processBudgetHolder = new CrmProcessBudgetHolder();
            if (StringUtils.isNotEmpty(adUserDetail.getEmail())) {
                processBudgetHolder.setEmail(StringUtils.revertString(adUserDetail.getEmail()));
            } else {
                processBudgetHolder.setEmail(StringUtils.revertString(dpRequest.getBudgetholderemail()));
            }
            processBudgetHolder.setId(StringUtils.revertString(dpRequest.getBudgetholderid()));
            processBudgetHolder.setPhone(StringUtils.revertString(dpRequest.getBudgetholderphone()));
            processBudgetHolder.setRemark(StringUtils.revertString(dpRequest.getBudgetholderremark()));
            processBudgetHolder.setName(StringUtils.revertString(dpRequest.getBudgetholdername()));
            CrmProcessInformationDetail.setProcessBudgetHolder(processBudgetHolder);
        }

    }

    private void detailSetPaymentMethod(DpRequest dpRequest, CrmProcessInformationDetail CrmProcessInformationDetail) {
        CrmProcessInformationDetail.setChartOfAccount(StringUtils.revertString(dpRequest.getChartofaccount()));
        CrmProcessInformationDetail.setQuotationTotal(dpRequest.getQuotationtotal().toString());
        CrmProcessInformationDetail.setQuotationTotal(CrmProcessInformationDetail.getQuotationTotal().substring(0, CrmProcessInformationDetail.getQuotationTotal().indexOf(".") + 3));
        CrmProcessInformationDetail.setFundConfirmed(dpRequest.getFundconfirmed() == null ? "" :
                dpRequest.getFundconfirmed().toString());
        if (StringUtils.isNotEmpty(CrmProcessInformationDetail.getFundConfirmed())) {
            CrmProcessInformationDetail.setFundConfirmed(CrmProcessInformationDetail.getFundConfirmed().substring(0, CrmProcessInformationDetail.getFundConfirmed().indexOf(".") + 3));
        }
        if (dpRequest.getFundtransferredtohsteam() == null) {
            dpRequest.setFundtransferredtohsteam(9);
        }
    }

    @Override
    public void sendCrmProcessMailForProd(ProcessSendEmailParam param) {
        try {
            log.info("received request:" + JSON_MAPPER.writeValueAsString(param));
        } catch (JsonProcessingException e) {
            log.info(param.toString());
        }
        try {
            PROCESS_SEND_PARAM_THREAD_LOCAL.set(new WeakReference<>(param));
            synchronized (Thread.currentThread()) {
                for (CrmProcessSendEmail CrmProcessSendEmail : CrmProcessSendEmails) {
                    if (CrmProcessSendEmail.prodNo().equals(param.getProdNo())) {
                        CrmProcessSendEmail.sendEmail(param.getRequestNo());
                        return;
                    }
                }
            }
            throw new CustomException("not exist prod");
        } catch (Exception e) {
            log.error("request：" + param.getRequestNo(), e);
            if (e instanceof CustomException) {
                CustomException e1 = (CustomException) e;
                log.error("request:" + param.getRequestNo() + "--------------------" + e1.getCustomMessage());
            } else {
                log.error("request:" + param.getRequestNo() + "--------------------", e);
            }
            this.saveEmailErrorLog(e);
        }
    }

    public void setDetailPageRequestHrefAddress(CrmProcessInformationDetail data, Map<String, Object> map) {
        String domain = getDomain();
        map.put("href", domain + "/request/detail/" + data.getRequestNo() + "/" + data.getRequestType());
        log.info(domain);
    }

    private String getDomain() {
        return this.domain;
    }

    public void setDetailPageActionHrefAddress(CrmProcessInformationDetail data, Map<String, Object> map) {
        String domain = getDomain();
        map.put("href", domain + "/action/detail/" + data.getRequestNo() + "/" + data.getRequestType());
        log.info(domain);
    }

    public String appTypeParseDetailName(CrmProcessInformationDetail data) {
        String appType = null;
        switch (data.getRequestType()) {
            case "AP":
                appType = "WLAN Access Point";
                break;
            case "DP":
                appType = "Data Port";
                break;
            default:

                break;
        }
        return appType;
    }

    @Override
    public CrmProcessAdGroupUserInfo getAdUserDetail(String username) {
        ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
        map.put("username", username);
        Map<String, Object> data = (Map<String, Object>) adController.findUser(map).get("data");
        try {
            log.info("ad group result:{}", JSON_MAPPER.writeValueAsString(data));
        } catch (Exception e) {
            log.info("ad group result:{}", data);
        }
        CrmProcessAdGroupUserInfo CrmProcessAdGroupUserInfo = new CrmProcessAdGroupUserInfo();
        if (data != null) {
            CrmProcessAdGroupUserInfo.setEmail(StringUtils.revertString(data.get("mail")));
            CrmProcessAdGroupUserInfo.setName(StringUtils.revertString(data.get("displayName")));
            CrmProcessAdGroupUserInfo.setPhone(StringUtils.revertString(data.get("phone")));
        } else {
            log.warn("username【" + username + "】 can't find ad group");
            CrmProcessAdGroupUserInfo.setEmail("");
            CrmProcessAdGroupUserInfo.setName("");
            CrmProcessAdGroupUserInfo.setPhone("");
            this.saveEmailErrorLog(new CustomException("username【" + username + "】 can't find ad group"));
        }
        return CrmProcessAdGroupUserInfo;
    }

    @Override
    public void saveEmailErrorLog(Exception e){
        ProcessSendEmailParam processSendEmailParam = PROCESS_SEND_PARAM_THREAD_LOCAL.get().get();
        executor.execute(()->{
            try {
                EmailErrorLog emailErrorLog = new EmailErrorLog();
                emailErrorLog.setType("dp/de-request");
                emailErrorLog.setProdNum(processSendEmailParam.getProdNo());
                emailErrorLog.setRequestNo(processSendEmailParam.getRequestNo());
                emailErrorLog.setErrorLog(JSON_MAPPER.writeValueAsString(e));
                emailErrorLogMapper.insert(emailErrorLog);
            }catch (Exception ex){
                log.error("log error:",ex);
            }
        });
    }*/
}
