import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Map "mo:map/Map";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import UUID "mo:uuid/UUID";
import ICRC "./ICRC";
import SourceV4 "mo:uuid/async/SourceV4";

shared ({caller = _owner}) actor class W3T(
  init_args : {
    token_canister_id: Text;
  }
) = this {
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
    
    let w3tToken : ICRC.Actor = actor (init_args.token_canister_id);
    stable var balanceOf = Map.new<Text, Nat>();

    type TextResponse = Result.Result<Text, GeneralError>;
    type GeneralError = {
        #userNotAuthorized;
        #keyNotFound;
        #chunkNotFound;
        #indexOutOfBound;
        #notEnoughBalance;
        #withdrawFailed;
        #failedToConnect;
    };

    // ==============================================================================================================================

    public query ({caller}) func getMyRole () : async Role {
      return getRole(caller);
    };

    func getRole(caller: Principal) : Role {
      let callerRole = switch (Map.get(roleMap, Map.thash, Principal.toText(caller))) {
        case (?_role) { _role };
        case null { #User };
      }; 
      return callerRole;
    };  

    public shared ({caller}) func addPolice (police: Principal) : async TextResponse {
      if (Principal.isAnonymous(caller) or caller != owner) return #err(#userNotAuthorized);

      Map.set(roleMap, Map.thash, Principal.toText(police), #Police);
      return #ok("New police has been added");
    };

    public shared ({caller}) func validateReportStatus (uid: Text, status: ReportStatus, policeReportNumber: ?Text) : async TextResponse {
      if (Principal.isAnonymous(caller) or (getRole(caller) != #Police)) return #err(#userNotAuthorized);

      switch (Map.get(reports, Map.thash, uid)){
        case (?_report) {
          let updateReport: Report = {
            reporter = _report.reporter;
            police = _report.police;
            violationType = _report.violationType;
            status = status;
            licenseNumber = _report.licenseNumber;
            policeReportNumber = policeReportNumber;
            stakeAmount = _report.stakeAmount;
            rewardAmount = _report.rewardAmount;
            submittedAt = _report.submittedAt;
            validatedAt = ?Time.now();
            rewardPaidAt = _report.rewardPaidAt;
          };
          Map.set(reports, Map.thash, uid, updateReport);
        };
        case null { return #err(#keyNotFound); };
      };

      return #ok("Status has been updated.");
    };

    // ==============================================================================================================================

    type UidReport = (Text, Report);
    type GetReportsResponse = Result.Result<[UidReport], GeneralError>;
    public query ({caller}) func getAllReports () : async GetReportsResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);

      let uidIter = Map.keys(reports);
      let uidArray: [Text] = Iter.toArray(uidIter);

      return #ok(collectReports(uidArray));
    }; 

    public query ({caller}) func getAllVideos () : async Result.Result<[[Blob]], GeneralError> {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);

      let videosIter = Map.vals(videosReportMap);
      return #ok(Iter.toArray(videosIter));
    }; 

    public query ({caller}) func getMyReports () : async GetReportsResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);

      switch (Map.get(addressReportMap, Map.thash, Principal.toText(caller))) {
        case (?_uids) { return #ok(collectReports(_uids)); };
        case null { return #ok([]); };
      };
    };

    func collectReports(uids: [Text]) : [UidReport] {
      var collectedReports: [UidReport] = [];
      for (uid in uids.vals()) {
        switch (Map.get(reports, Map.thash, uid)) {
          case (?report) { collectedReports := Array.append(collectedReports, [(uid, report)]); };
          case null {};
        };
      };
      return collectedReports;
    };


    public shared ({caller}) func submitReport(report: Report) : async TextResponse {
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

    // ==============================================================================================================================

    public shared ({caller}) func uploadVideoByChunk(uid: Text, chunk: Blob) : async TextResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      if (findUidBasedOnCaller(uid, caller) == false) { return #err(#keyNotFound); };

      var returnedText: Text = "";
      var videoChunks: [Blob] = switch (Map.get(videosReportMap, Map.thash, uid)) {
        case(?_chunks) { 
          returnedText := Nat.toText(_chunks.size());
          _chunks; 
        };
        case null { 
          returnedText := "Chunks not found, returning empty string";
          []; 
        };
      };      

      videoChunks := Array.append(videoChunks, [chunk]);
      Map.set(videosReportMap, Map.thash, uid, videoChunks);

      return #ok(returnedText);
    };

    public shared ({caller}) func deleteVideo(uid: Text) : async TextResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      if (findUidBasedOnCaller(uid, caller) == false) { return #err(#keyNotFound); };
      
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
      if (findUidBasedOnCaller(uid, caller) == false) { return #err(#keyNotFound); };

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

    func findUidBasedOnCaller(uid: Text, caller: Principal) : Bool {
      switch (Map.get(addressReportMap, Map.thash, Principal.toText(caller))) {
        case (?_uids) { 
          switch (Array.find(_uids, func (_uid: Text): Bool { _uid == uid })) {
            case (?_found) { return true };
            case null { return false; };
          };
        };
        case null { return false; };
      };
    };

    // ==============================================================================================================================

    type NatResponse = Result.Result<Nat, GeneralError>;
    public shared ({caller}) func withdrawToken(amount: Nat) : async NatResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      if (_getBalanceOf(caller) < amount) return #err(#notEnoughBalance);

      let transferRes = await w3tToken.icrc1_transfer({
        from_subaccount = null;
        to = { owner = caller; subaccount = null };
        amount = amount;
        fee = null;
        memo = null;
        created_at_time = null;
      });

      switch (transferRes) {
        case (#Ok(block_height)) {
            return #ok(block_height); // Return the block height if successful
        };
        case (#Err(_)) {
            return #err(#withdrawFailed); // Return error message
        };
      };
    };

    public func getToken () : async TextResponse {
      try {
        let _ = await w3tToken.icrc1_symbol();
        #ok("Successfully connected to token canister");
      } catch (_) {
        #err(#failedToConnect);
      }
    };
      
    private func _getBalanceOf(principal: Principal) : Nat {
      let balance = switch(Map.get(balanceOf, Map.thash, Principal.toText(principal))) {
        case(?balance) { balance };
        case(null) { 0 };
      };

      return balance;
    };

    public shared ({caller}) func getMyBalance() : async NatResponse {
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

    public shared ({caller}) func deposit(amount: Nat) : async NatResponse {
      if (Principal.isAnonymous(caller)) return #err(#userNotAuthorized);
      _addBalance(caller, amount);
      #ok(0);
    };
}