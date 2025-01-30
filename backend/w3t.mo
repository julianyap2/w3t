import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Map "mo:map/Map";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Int8 "mo:base/Int8";
import Debug "mo:base/Debug";
import UUID "mo:uuid/UUID";
import SourceV4 "mo:uuid/async/SourceV4";

shared ({caller = _owner}) actor class W3T () {
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
      licenseNumber: Text;
      policeReportNumber: ?Text;
      stakeAmount: Nat;
      rewardAmount: Nat;
      submittedAt: ?Time.Time;
      validatedAt: ?Time.Time;
      rewardPaidAt: ?Time.Time;
    };

    type Role = {
      #SuperAdmin;
      #Police;
      #User;
    };

    private stable let owner: Principal = _owner;
    private stable var roleMap = Map.new<Text, Role>();

    stable var addressReportMap = Map.new<Text, [Text]>();
    stable var reports = Map.new<Text, Report>();
    stable var videosReportMap = Map.new<Text, [Blob]>();
    stable var balanceOf = Map.new<Text, Nat>();

    type GeneralResponse = Result.Result<Text, GeneralError>;
    type GeneralError = {
        #userNotAuthorized;
        #keyNotFound;
        #chunkNotFound;
        #indexOutOfBound;
        #notEnoughBalance;
    };

    // ==============================================================================================================================

    public shared ({caller}) func addPolice (police: Principal) : async GeneralResponse {
      if (Principal.isAnonymous(caller) or caller != owner) return #err(#userNotAuthorized);

      Map.set(roleMap, Map.thash, Principal.toText(caller), #Police);
      return #ok("New police has been added");
    };

    // public shared ({caller}) func validateReportStatus (uid: Text, status: ReportStatus) : async GeneralResponse {
    //   let callerRole = switch (Map.get(roleMap, Map.thash, Principal.toText(caller))) {
    //     case (?_role) { _role };
    //     case null { #User };
    //   };
    //   if (Principal.isAnonymous(caller) or (callerRole != #Police)) return #err(#userNotAuthorized);

    //   switch (Map.get(reports, Map.thash, uid)){
    //     case (?_report) {
    //       var updatedReport = _report;
    //       updatedReport.status := status;
    //     };
    //     case null {};
    //   };

    //   return #ok("Status has been updated.");
    // };

    // ==============================================================================================================================
    
    private func _getBalanceOf(principal: Principal) : Nat {
      let balance = switch(Map.get(balanceOf, Map.thash, Principal.toText(principal))) {
        case(?balance) { balance };
        case(null) { 0 };
      };

      return balance;
    };

    public shared ({caller}) func getMyBalance() : async Result.Result<Nat, GeneralError> {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      let balance = _getBalanceOf(caller);
      #ok(balance);
    };

    private func _addBalance(principal: Principal, amount: Nat) {
      let old_balance = _getBalanceOf(principal);
      Map.set(balanceOf, Map.thash, Principal.toText(principal), old_balance + amount);
    };

    private func _subtractBalance(principal: Principal, amount: Nat) {
      let old_balance = _getBalanceOf(principal);
      let new_balance: Int = old_balance - amount;
      if(new_balance < 0) return;
      Map.set(balanceOf, Map.thash, Principal.toText(principal), old_balance - amount);
    };

    public shared ({caller}) func deposit(amount: Nat) : async Result.Result<Nat, GeneralError> {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      _addBalance(caller, amount);
      #ok(0);
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


    public shared ({caller}) func submitReport(report: Report) : async GeneralResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      if ((_getBalanceOf(caller)) < report.stakeAmount) return #err(#notEnoughBalance);

      let uuidGenerator = SourceV4.Source();
      let uuid = await uuidGenerator.new();
      let uuidText = UUID.toText(uuid);

      var uids: [Text] = [];
      switch (Map.get(addressReportMap, Map.thash, Principal.toText(caller))) {
        case(?_uids) { uids := Array.append(_uids, [uuidText]); };
        case null { };
      };
      
      Map.set(addressReportMap, Map.thash, Principal.toText(caller), [uuidText]);
      Map.set(reports, Map.thash, uuidText, report);
      _subtractBalance(caller, report.stakeAmount);
      return #ok(uuidText);
    };

    public shared ({caller}) func uploadVideoByChunk(uid: Text, chunk: Blob) : async Result.Result<Text, GeneralError> {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);

      switch (Map.get(addressReportMap, Map.thash, Principal.toText(caller))) {
        case (?_) {  };
        case null { return #err(#keyNotFound); };
      };

      var videoChunks: [Blob] = switch (Map.get(videosReportMap, Map.thash, uid)) {
        case(?_chunks) { _chunks; };
        case null { []; };
      };      

      videoChunks := Array.append(videoChunks, [chunk]);
      Map.set(videosReportMap, Map.thash, uid, videoChunks);

      return #ok("Chunk uploaded.");
    };

    public shared ({caller}) func deleteVideo(uid: Text) : async GeneralResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);

      switch (Map.get(videosReportMap, Map.thash, uid)) {
        case (?_chunks) { 
          Map.set(videosReportMap, Map.thash, uid, []);
        };
        case null { return #err(#keyNotFound); }
      };
      return #ok("Video deleted.");
    };
    
    type GetVideoChunkResponse = Result.Result<Blob, GeneralError>;
    public query ({caller}) func getVideoChunk(uid: Text, index: Nat) : async GetVideoChunkResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);

      switch (Map.get(videosReportMap, Map.thash, uid)) {
        case (?_chunks) { 
          if (index >= _chunks.size()) {
            return #err(#indexOutOfBound);
          };
          return #ok(_chunks[index]);
        };
        case null { return #err(#chunkNotFound); }
      };
    };

    public query ({caller}) func getCallerPrincipalToText() : async Text {
      return Principal.toText(caller);
    };

}