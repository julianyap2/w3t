import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Map "mo:map/Map";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Int16 "mo:base/Int16";
import Int8 "mo:base/Int8";
import UUID "mo:uuid/UUID";

actor {
    type ViolationType = {
        #LLAJ222009_291;
        #LLAJ222009_287;
        #LLAJ222009_283;
    };

    type ReportStatus = {
        #OnValidationProcess;
        #GuiltyWaitingForFineToBePaid;
        #GuiltyFinePaid;
        #NotGuilty;
    };

    type Report = {
        reporter: Principal;
        police: Principal;
        violationType: ViolationType;
        status: ReportStatus;
        video: Blob;
        licenseNumber: Text;
        policeReportNumber: ?Text;
        stakeAmount: Nat;
        rewardAmount: Nat;
        submittedAt: ?Time.Time;
        validatedAt: ?Time.Time;
        rewardPaidAt: ?Time.Time;
    };

    stable var addressReportMap = Map.new<Text, [Text]>();
    stable var reports = Map.new<Text, Report>();

    type GeneralError = {
        #userNotAuthorized;
    };

    type GetReportsResponse = Result.Result<[Report], GeneralError>;

    public query ({caller}) func getAllReports () : async GetReportsResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      let reportsIter = Map.vals(reports);
      return #ok(Iter.toArray(reportsIter));
    }; 

    public query ({caller}) func getAllReportsWithPagination () : async GetReportsResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      let reportsIter = Map.vals(reports);
      return #ok(Iter.toArray(reportsIter));
    }; 

    public query ({caller}) func getMyReports (pagination: ?Int8, section: ?Int8) : async GetReportsResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      switch (Map.get(addressReportMap, Map.thash, Principal.toText(caller))) {
        case (?_uids) { return #ok(collectReports(_uids, pagination, section)); };
        case null { return #ok([]); };
      };
    };

    func collectReports(uids: [Text], pagination: ?Int8, section: ?Int8) : [Report] {
      var collectedReports: [Report] = [];
      for (uid in uids.vals()) {
        switch (Map.get(reports, Map.thash, uid)) {
          case (?report) { collectedReports := Array.append(collectedReports, [report]); };
          case null {};
        };
      };
      return collectedReports;
    };

    type SubmitReportResponse = Result.Result<Report, GeneralError>;

    public shared ({caller}) func submitReport(report: Report) : async SubmitReportResponse {
        if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
        return #ok(report);
    };
 
}