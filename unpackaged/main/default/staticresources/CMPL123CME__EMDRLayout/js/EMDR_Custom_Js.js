 /* EMDR Custom JS */
                    var showEMDRWorkflowPanel = '';
                    var apiFieldError = '';
                    var setLookupValue;
                    var removeLookupValue;      
                    var app = angular.module("app",['ui.bootstrap','isteven-multi-select']); 
                    var errorMessages;
                    var pageTheme = "{!$User.UIThemeDisplayed}";
                    app.directive('createpopover',function(){
                       return function(scope, element, attrs, controller) {
                           element = $(element[0]);
                           var content  = "Initial: "+attrs.content;
                           var obj = {}
                           obj.title= content  ;
                           if(recTypeName == 'Supplemental')
                               element.tooltip(obj);
                       };
                   
                    });
                    app.directive('datetimepicker',function(){
                         return function(scope, element, attrs, controller) {
                               var oldVal = '';
                               element = $(element[0]);
                               var apiName=  attrs.id.split("~")[0];
                               var dtFormat = dateTimeFormat.indexOf("a") > -1 ? dateTimeFormat.replace("a","A") : dateTimeFormat;
                               dtFormat = dtFormat.split(" ")[0].toUpperCase()+dtFormat.substring(dtFormat.split(" ")[0].length);
                               var validation =  attrs.type == "datetime" ? dtFormat : scope.format;
                               
                               if(attrs.type == "datetime"){
                                   element.datetimepicker({
                                       format: dtFormat,
                                       useCurrent: false,  
                                       allowInputToggle : true,
                                       keepInvalid : true,
                                       widgetPositioning :  {horizontal : "right" , vertical : "bottom"},
                                      
                                   });
                               }else{
                                   element.datetimepicker({
                                         format : scope.format,
                                         useCurrent: false,  
                                         allowInputToggle : true,
                                         keepInvalid : true,
                                         widgetPositioning :  {horizontal : "right" , vertical : "bottom"},
                                       
                                   });
                               }
                              
                               element.on("dp.change",function(input){
                                    scope.fields[apiName].value = element.find("input").val();
                                    element.find("input").removeClass("ng-invalid");
                                    if(!element.find("input").hasClass("ng-dirty")){
                                        scope.changeTabColor(attrs.id.split("~")[1]);
                                        element.find("input").addClass("ng-dirty");
                                    }
                                    scope.$apply();
                               });
                               
                                element.find("input").on("keyup",function(){
                                    var isValid = moment(element.find("input").val(),validation).isValid();
                                    if(isValid ==  false && element.find("input").val() != null &&  element.find("input").val().length > 0){
                                        if(!element.find("input").hasClass("ng-invalid")){
                                            element.find("input").addClass("ng-invalid");
                                        }
                                        scope.loginForm.$invalid= true;
                                    }else{
                                         element.find("input").removeClass("ng-invalid");
                                         if(!element.find("input").hasClass("ng-dirty")){
                                              element.find("input").addClass("ng-dirty");
                                         }
                                         scope.loginForm.$invalid= false;
                                    }
                                    scope.$apply();
                               });
                                element.on("dp.show",function(){
                                    scope.loginForm.$dirty = true;
                                    scope.$apply();
                                });
								 element.on("dp.hide",function(){
                                     scope.fields[apiName].value = element.find("input").val();
                                      scope.$apply();
                                });
                         
                         };
                    
                    });
                    
                    app.service("remoteCall",function($q,$rootScope){
                        return  function(remoteAction){
                            var deferred = $q.defer();
                            Visualforce.remoting.Manager.invokeAction(remoteAction,function(result,event){
                                if(event.status){
                                    deferred.resolve(result);                                
                                }else{
                                    deferred.reject(event);
                                }        
                            },{escape:true});
                                return deferred.promise;     
                            }                        
                    });
                    
                    app.service("getTabs",function($q,$rootScope){
                        return  function(remoteAction,obj,paramter){
                            var deferred = $q.defer();
                            Visualforce.remoting.Manager.invokeAction(remoteAction,obj,paramter,function(result,event){
                                if(event.status){
                                    deferred.resolve(result);
                                }else{
                                    deferred.reject(event);
                                }                            
                            },{escape:true});
                               return deferred.promise;     
                        }
                    
                    });
                    
                    app.service("remoteCalldoubbleParamter",function($q,$rootScope){
                         return  function(remoteAction,reqString){
                             var deferred = $q.defer();
                             Visualforce.remoting.Manager.invokeAction(remoteAction,reqString,function(result,event){
                                if(event.status){
                                    deferred.resolve(result);
                                }else{
                                    deferred.reject(event);
                                }
                                
                             },{escape:true});
                            
                            return deferred.promise;     
                        }
                    });
                    
                    app.service("saveRecord",function($q,$rootScope){
                        return  function(remoteAction,obj,recDet){
                        var deferred = $q.defer();
                        Visualforce.remoting.Manager.invokeAction(remoteAction,obj,recDet,function(result,event){
                            if(event.status){
                                deferred.resolve(result);
                            }else{
                                deferred.reject(event);
                            }
                            
                        },{escape:true});
                           return deferred.promise;     
                        }
                    
                    });
                    
                    app.service("remoteCallTripleParamter",function($q,$rootScope){
                        return  function(remoteAction,obj,paramter){
                        var deferred = $q.defer();
                        Visualforce.remoting.Manager.invokeAction(remoteAction,obj,paramter,function(result,event){
                            if(event.status){
                                deferred.resolve(result);
                            }else{
                                deferred.reject(event);
                            }
                            
                        },{escape:true});
                           return deferred.promise;     
                        }
                    
                    });
                    
                    app.controller("EMDRLayout",function($scope,$filter,$modal,$window,$compile,remoteCalldoubbleParamter,remoteCallTripleParamter,getTabs, $interval){ 
                         $scope.showWFPanel = isPanelEnabled;
                         $scope.remoteExceptionMsg=''; 
                         var qs = location.search; 
                         localStorage.clear();
                         $scope.emdrCCode = JSON.parse(emdrComplaintCode);

                         $scope.isFromEMDRConsole = (qs.length != 0 && ((qs.indexOf("?isdtp=") > -1) || (qs.indexOf("&isdtp=") > -1)));
                         
                         $scope.recordTypeName = recTypeName;
                         if(recTypeName == 'Supplemental' && placeHolderMap != null && placeHolderMap != ''){
                             $scope.placeHolderMap = JSON.parse(placeHolderMap);
                             $scope.initialCodeMap = JSON.parse(initialCodeMap);
                         }  

                         // var LocaleMap = {'ar':'DD/MM/YYYY','ar_AE':'DD/MM/YYYY','ar_BH':'DD/MM/YYYY','ar_JO':'DD/MM/YYYY','ar_KW':'DD/MM/YYYY','ar_LB':'DD/MM/YYYY','ar_SA':'DD/MM/YYYY','bg':'YYYY-M-D','ca':'DD/MM/YYYY','ca_ES':'DD/MM/YYYY','ca_ES_EURO':'DD/MM/YYYY','cs':'D.M.YYYY','cs_CZ':'D.M.YYYY','Da':'DD-MM-YYYY','Da_DK':'DD-MM-YYYY','De':'DD.MM.YYYY','De_AT':'DD.MM.YYYY','De_AT_EURO':'DD.MM.YYYY','De_CH':'DD.MM.YYYY','De_DE':'DD.MM.YYYY','De_DE_EURO':'DD.MM.YYYY','De_LU':'DD.MM.YYYY','De_LU_EURO':'DD.MM.YYYY','el_GR':'D/M/YYYY','en_AU':'D/MM/YYYY','en_B':'M/D/YYYY','en_BM':'M/D/YYYY','en_CA':'DD/MM/YYYY','en_GB':'DD/MM/YYYY','en_GH':'M/D/YYYY','en_ID':'M/D/YYYY','en_IE':'DD/MM/YYYY','en_IE_EURO':'DD/MM/YYYY','en_NZ':'D/MM/YYYY','en_SG':'M/D/YYYY','en_US':'M/D/YYYY','en_ZA':'YYYY/MM/DD','es':'D/MM/YYYY','es_AR':'DD/MM/YYYY','es_BO':'DD-MM-YYYY','es_CL':'DD-MM-YYYY','es_CO':'D/MM/YYYY','es_CR':'DD/MM/YYYY','es_EC':'DD/MM/YYYY','es_ES':'D/MM/YYYY','es_ES_EURO':'D/MM/YYYY','es_GT':'D/MM/YYYY','es_HN':'MM-DD-YYYY','es_MX':'D/MM/YYYY','es_PE':'DD/MM/YYYY','es_PR':'MM-DD-YYYY','es_PY':'DD/MM/YYYY','es_SV':'MM-DD-YYYY','es_UY':'DD/MM/YYYY','es_VE':'DD/MM/YYYY','et_EE':'D.MM.YYYY','fi':'D.M.YYYY','fi_FI':'D.M.YYYY','fi_FI_EURO':'D.M.YYYY','fr':'DD/MM/YYYY','fr_BE':'D/MM/YYYY','fr_CA':'YYYY-MM-DD','fr_CH':'DD.MM.YYYY','fr_FR':'DD/MM/YYYY','fr_FR_EURO':'DD/MM/YYYY','fr_LU':'DD/MM/YYYY','fr_MC':'DD/MM/YYYY','hr_HR':'YYYY.MM.DD','hu':'YYYY.MM.DD.','hy_AM':'M/D/YYYY','is_IS':'D.M.YYYY','it':'DD/MM/YYYY','it_CH':'DD.MM.YYYY','it_IT':'DD/MM/YYYY','iw':'H DD/MM/YYYY','iw_IL':'DD/MM/YYYY','ja':'YYYY/MM/DD','ja_JP':'YYYY/MM/DD','ka':'YYYY-MM-DD','kk_KZ':'DD.MM.YYYY','kM_KH':'M/D/YYYY','ko':'YYYY. M. D','ko_KR':'YYYY. M. D','lt_LT':'YYYY.M.D','lv_LV':'YYYY.D.M','Ms_MY':'DD/MM/YYYY','nl':'D-M-YYYY','nl_BE':'D/MM/YYYY','nl_NL':'D-M-YYYY','nl_SR':'D-M-YYYY','no':'DD.MM.YYYY','no_NO':'DD.MM.YYYY','pl':'YYYY-MM-DD','pt':'DD-MM-YYYY','pt_AO':'DD-MM-YYYY','pt_BR':'DD/MM/YYYY','pt_PT':'DD-MM-YYYY','ro_RO':'DD.MM.YYYY','ru':'DD.MM.YYYY','sk_SK':'D.M.YYYY','sl_SI':'D.M.y','sr':'DD.MM.YYYY.','sv':'YYYY-MM-DD','sv_SE':'YYYY-MM-DD','th':'M/D/YYYY','th_TH':'D/M/YYYY','tr':'DD.MM.YYYY','uk':'DD.MM.YYYY','ur_PK':'M/D/YYYY','vi_VN':'DD/MM/YYYY','zh':'YYYY-M-D','zh_CN':'YYYY-M-D','zh_HK':'YYYY-M-D','zh_TW':'YYYY/M/D', 'en_IN':'DD/MM/YYYY','be_BY':'D.M.YYYY','ar_AE':'DD/MM/YYYY'};
                         $scope.urlParamsMapString = urlParams;     
                         //$scope.format = LocaleMap[dateFormat] == undefined ? 'dd/MM/yyyy' : LocaleMap[dateFormat];
                         $scope.format = dateTimeFormat.split(" ")[0].toUpperCase();
                         $scope.tabs =[];
                         $scope.cloneTab =[];
                         $scope.dateTimeFormat = dateTimeFormat;
                         $scope.remoteError = false;
                         $scope.id = recid;

                         //By default assigning EMDR formVersionDisabled false
                         $scope.formVersionDisabled = false;

                         $scope.isClone = isClone;
                         
                         $scope.recordDetails = {};
                         var recordDet = {};
                         recordDet.recId = $scope.id;
                         recordDet.recType = recType;
                         recordDet.isClone = (isClone ? '1' :'0');

                         //By default assigning EMDR picklist form version to false
                         recordDet.isEMDRFormVersionChanged = false;
                         recordDet.cloneId = cloneId;
                         $scope.recordDetails = recordDet;
                         $scope.id = isClone ? '' : $scope.id;
                         remoteCallTripleParamter(sectionDetails, JSON.stringify($scope.recordDetails), pageTheme).then(function(result){
                            var obj =  JSON.parse(htmlDecode(result));
                            $scope.emdrCCode = obj.translateCCode;
                            //Assigning scope variable data of backend result
                            $scope.formVersionDisabled = obj.isEMDRFormVersionDisabled;
                            $scope.fields = obj.Fields;
                            //Assigning form version value to scope variable from fields data
                            if ($scope.fields != null && $scope.fields[emdrFormVersionWithNS] != undefined) {
                                $scope.recordDetails.emdrVersionFormat = $scope.fields[emdrFormVersionWithNS].value;
                            }
                             $scope.oldFieldVal =   angular.copy(obj.Fields);  
                             delete  obj.Fields;  
                             setObject(obj);  
                         });
                            
                        function setObject(obj){
                            $scope.tabs = obj.Tabs;
                            $scope.cloneTab  = angular.copy(obj.Tabs);  
                            $scope.RelatedApiIdMap = JSON.parse(obj.RelatedApiIdMap);   
                            $scope.timeZoneOffset  = obj.TZOffset;
                            if($scope.id.length > 0){
                                $scope.relatedListDown  = JSON.parse(obj.List);   
                                callRelatedList();                         
                            }
                              
                                                 
                            var id_15 = $scope.id.length > 15 ? $scope.id.substring(0,15) : $scope.id;
                            tabIndex  = 0;
                          
                            $scope.tabSelected = $scope.tabs[tabIndex].tabPosition;
                        };                          
                        
                        $scope.setDateTime = function(input,api,torder){
                            $scope.changeTabColor(torder);
                            var val = '';
                            if(input != undefined && input != null &&  input != 'NaN/NaN/0NaN'){
                                val = $filter('date')(input,$scope.dateTimeFormat);                               
                            }              
                            $scope.fields[api].value = val;
                        }                        
                        
                        function setFields() {                  
                            remoteCalldoubbleParamter(fields, JSON.stringify($scope.recordDetails)).then(function(result){ 
                               var obj =  JSON.parse(htmlDecode(result));
                               $scope.fields = obj.Fields;    
                               $scope.oldFieldVal =   angular.copy(obj.Fields);                 
                            });
                        };
                        
                        $scope.checkRequired = function(tab, fieldOrder){
                            var isRequired = $scope.cloneTab[tab].fieldList[fieldOrder].isRequired;        
                            $scope.tabs[tab].fieldList[fieldOrder].isCloneRequired = isRequired;
                        };
                        
                        function callRelatedList() {
                            remoteCalldoubbleParamter(relatedList, JSON.stringify($scope.recordDetails)).then(function(result){
                                var obj = JSON.parse((htmlDecode(result)));
                                $scope.relatedListItem =  JSON.parse(obj.RelatedObj);
                                $scope.Buttons = JSON.parse(obj.Buttons);
                            });
                        };
                        
                        $scope.changeTab = function(keyPosition){
                            $scope.tabSelected = keyPosition;
                         
                        };
                        
                        $scope.showDiv1=function(){
                            $scope.displayDiv = true;
                        };
                        $scope.hideDiv= function(){
                            $scope.displayDiv = false;
                        }; 
                        $scope.showDiv= function(relName){
                            $scope.displayDiv = true;
                            $scope.relName=relName;
                        };
                        $scope.setPicklistValue = function(data,obj,index,order,apiName,picklist){
                            
                            $scope.changeTabColor(order);
                            $scope.makeDateTimeDirty(apiName+order);
                            $scope.loginForm.$dirty = true;
                            $scope.fields[apiName].value = data.value;
                            for(var i=0;i<$scope.fields[apiName].pickVals.length;i++){
                                 if($scope.fields[apiName].pickVals[i].value == data.value)
                                     $scope.fields[apiName].pickVals[i].ticked =true;
                                  else
                                     $scope.fields[apiName].pickVals[i].ticked =false;
                            }
                         
                            $scope.$apply();

                            if (apiName == emdrFormVersionWithNS) {
                                var recordDet = {};
                                recordDet.recId = $scope.id;
                                recordDet.recType = recType;
                                recordDet.isClone = (isClone ? '1' :'0');
                                recordDet.emdrVersionFormat = data.value;
                                //On change of picklist value setting isEMDRFormVersionChanged value to true
                                recordDet.isEMDRFormVersionChanged = true;
                                recordDet.cloneId = cloneId;
                                $scope.recordDetails = recordDet;

                                $scope.fields = null;
                                $scope.tabs = null;
                                remoteCallTripleParamter(sectionDetails, JSON.stringify($scope.recordDetails), pageTheme).then(function(result){
                                    obj =  JSON.parse(htmlDecode(result));
                                    $scope.emdrCCode = obj.translateCCode;
                                    $scope.fields = obj.Fields;
                                    //Assigning form version value to scope variable from fields data
                                    if ($scope.fields != null && $scope.fields[emdrFormVersionWithNS] != undefined) {
                                        $scope.recordDetails.emdrVersionFormat = $scope.fields[emdrFormVersionWithNS].value;
                                    }
                                    $scope.oldFieldVal = angular.copy(obj.Fields);
                                    delete  obj.Fields;
                                    setObject(obj);
                                });
                            }
                        };
                        
                        $scope.setMultiPicklistValue = function(data,index,picklistValue,order,apiName){
                            $scope.changeTabColor(order);
                            $scope.makeDateTimeDirty(apiName+order);
                            $scope.loginForm.$dirty = true;
                            var str='';
                            for(var key=0;key<picklistValue.length;key++){
                               str += picklistValue[key].value+';';
                               setPickValToTrue(apiName,data);
                            }
                          
                            str = str.substring(0,str.lastIndexOf(';'));
                            $scope.fields[apiName].value = str; 
                            $scope.$apply();
                        };
                        
                        function setPickValToTrue(apiName,val){
                            for(var a = 0;a<$scope.fields[apiName].pickVals.length;a++){
                               if($scope.fields[apiName].pickVals[a].value == val.value){
                                   $scope.fields[apiName].pickVals[a].ticked = val.ticked;
                                   break;
                               }    
                            }
                        };
                        
                        $scope.resetMultiselect = function(order,index,apiName){
                             $scope.makeDateTimeDirty(apiName+order);
                             $scope.loginForm.$dirty = true;
                             $scope.changeTabColor(order);
                             for(var a = 0;a<$scope.fields[apiName].pickVals.length;a++){
                                 $scope.fields[apiName].pickVals[a].ticked = false;    
                             }    
                             $scope.fields[apiName].value = '';
                        };
                        
                        $scope.selectAll = function(data,index,picklistValue,order,apiName){
                            $scope.changeTabColor(order);
                            $scope.makeDateTimeDirty(apiName+order);
                            $scope.loginForm.$dirty = true;
                            var str='';
                            for(var key=0;key< $scope.fields[apiName].pickVals.length;key++){
                                str += $scope.fields[apiName].pickVals[key].value+';';
                                $scope.fields[apiName].pickVals[key].ticked = true;
                            }
                            str = str.substring(0,str.lastIndexOf(';'));
                            $scope.fields[apiName].value = str;
                        };
                        
                        showEMDRWorkflowPanel= function(error){ 
                            if(error.indexOf('(') > -1){
                                 var apiName = ((error.indexOf('(')) > -1 && (error.indexOf('(') >-1)) ? error.substring(error.indexOf('(')+1,error.indexOf(')')) : '';
                                 apiFieldError = apiName;
                                 if(apiName.length >0 ){
                                        $("."+apiName.trim()).html(error.substring(error.lastIndexOf(':')+1,error.length));
                                        var name = $("."+apiName.trim()).parent().prev().attr('name');
                                        name = name.replace(apiName,'');
                                        $scope.tabs[name].panelResult =  true;
                                   }
                             }else{
                                 $scope.worlflowPanelError = error;
                             }
                            $scope.$apply();
                        } 
                        
                        
                        if ($scope.isFromEMDRConsole && redirect) { 
                            redirect = function(){
                                if (lexUtil.inLEX()) {
                                    if (lexUtil.viewRecord) {
                                        lexUtil.viewRecord($scope.id);
                                    } else {
                                        lexUtil.lexNavigateToSObject($scope.id);
                                    }
                                } else {
                                    window.location.reload();
                                }
                            }
                        }
                          
                        $scope.makeDateTimeDirty = function(name){
                            if(angular.element(document.getElementsByName(name)[0]).find("button").length > 0)
                                angular.element(document.getElementsByName(name)[0]).find("button").eq(0).addClass('ng-dirty');
                            else
                                angular.element(document.getElementsByName(name)[0]).addClass('ng-dirty');    
                            
                        }; 
                        
                        $scope.openWindow = function(apiName,fieldValue,keyPrefix){
                             var recordId  = recid.length == 0 ?  emdrKeyPrefix : recid;
                             var dplpVal = recid.length == 0 ?  null : recid;
                             if(fieldValue != null){
                                if(apiName != 'OwnerId'){
                                    openLookup('/_ui/common/data/LookupPage?lkfm=loginForm&lknm=CF'+$scope.RelatedApiIdMap[apiName]+'&lktp='+keyPrefix+'&dplp=['+dplpVal+']',670,'1','&lksrch=' + escapeUTF(fieldValue.substring(0, 80))+'&lkfield='+$scope.RelatedApiIdMap[apiName]+'&lkent='+recordId.substring(0,3));
                                }
                                else{
                                    openLookup('/_ui/common/data/LookupPage?lkfm=loginForm&lknm=newOwn&lktp=StandardUserLookup',670,'1','&lksrch=' + escapeUTF(fieldValue.substring(0, 80)));
                                }
                             }
                        };
                        
                        $scope.getLookup = function(fieldApi,order,index){  
                            if($("#"+fieldApi+order).val().length >= 2){   
                                    $("#"+fieldApi+order).prev().show();             
                                    remoteCallTripleParamter(lookupFields,fieldApi,$("#"+fieldApi+order).val()).then(function(result){ 
                                       $("#"+fieldApi+order).prev().hide();           
                                       var reqResult  =  JSON.parse(htmlDecode(result));
                                       $("#"+fieldApi+order).autocomplete({
                                             source:reqResult,
                                             select:function(event,ui){
                                                  $scope.fields[fieldApi].value= ui.item.Id;
                                                  $scope.$apply();
                                             },
                                             minLength: 0                                  
                                       });
                                       $("#"+fieldApi+order).autocomplete( "search","");
                                  });
                             } 
                        };     
                        setLookupValue = function(reqId,fieldId,order,obj){  
                            $scope.changeTabColor(order.split('~')[0]);   
                            if(obj.val().length >0)
                                $scope.fields[$scope.tabs[order.split('~')[0]].fieldList[order.split('~')[1]].apiName].value = obj.prev().prev().val();
                            else{
                                $scope.fields[$scope.tabs[order.split('~')[0]].fieldList[order.split('~')[1]].apiName].value  = '';
                            }    
                            $scope.$apply();
                      
                       };
                        
                      removeLookupValue = function(api){                          
                           $scope.urlParamsMapString ="";
                           $scope.fields[api].value = "";
                           $scope.fields[api].formatValue = "";
                           $scope.$apply();
                           $scope.loginForm.$dirty = true;
                       };
                       
                        $scope.changeTabColor = function(pos){
                            $scope.tabs[pos].color= '2px solid orange';
                        }; 
                        
                       
                        $scope.navigatePage = function(url,behavior){  
                            var trgt = !behavior ? "_blank" : "_self";
                            url = url.replace('recordid',$scope.id);
                            window.open(url,trgt);
                        }; 
                     
                        $scope.refreshPage = function(){
                            var isConfirm= true;
                            if(isConfirm){
                               
                                $scope.loginForm.$setPristine();
                                $scope.fields = angular.copy($scope.oldFieldVal);
                                $scope.pageLabelErrorMessage='';
                                $scope.globalError = false;
                                $scope.isSubmitted = false;
                                $scope.exceptionMsg = '';
                                $(".panel-body").removeClass("ng-dirty");
                                $(".multiSelect").find("button").removeClass("ng-dirty");
                                for(key in $scope.tabs){  
                                     $scope.tabs[key].color = undefined;
                                     $scope.tabs[key].panelResult = false;
                                }
                                 $("[class*='CMPL123CMEDEV__']").html('');
                              
                            }
                        };    
                          
                        $scope.saveRecord = function(){                      
                            $scope.openReqModel($scope.fields,$scope.id, $scope.recordDetails.emdrVersionFormat);
                        };
                        
                        $scope.LookupHoverDetail = function(type,value,order,apiName){
                            var recordId =value;
                            var fieldFocus = apiName+order;
                            if(type == 'mouseout')
                                LookupHoverDetail.getHover(fieldFocus).hide();
                            else if(type == 'mouseover'){
                                LookupHoverDetail.getHover(fieldFocus,'/'+recordId+'/m?retURL=%2F'+recordId+'&isAjaxRequest=1').show();
                            } 
                        };
                        
                        $scope.openReqModel = function (tabObject, recordId, emdrVersFormat) {    
                            for(key in $scope.tabs){  
                                $scope.tabs[key].color = undefined;
                                $scope.tabs[key].panelResult = false;
                            
                            }                    
                             if(errorMessages != null){
                                for(var key in errorMessages['FieldLabel']){
                                    $scope.fields[key].message = '';
                                }
                             }
                             if(apiFieldError.length >0)
                                 $("."+apiFieldError).html('');
                             $scope.exceptionMsg =''; $scope.pageLabelErrorMessage='';$scope.worlflowPanelError='';
                             $scope.globalError = '';
                             var modalInstance = $modal.open({
                                templateUrl: 'loading.html',
                                controller: 'SaveController',
                                backdrop: "static",
                                size: 'lg',
                                windowClass:'loading',
                                resolve: {
                                   tab:function(){
                                        return tabObject;
                                    },
                                    id:function(){
                                        return recordId;
                                    },
                                    emdrVersionFormat: function() {
                                        return emdrVersFormat;
                                    }
                                }
                           });
                           
                           modalInstance.result.then(function (reqResult){
                               if(reqResult.message == undefined){
                                     reqResult = JSON.parse(htmlDecode(reqResult));
                                     var id = reqResult['emdrId'];
                                     if((id != null) && (id.length == 15 || id.length == 18)){
                                        //Setting scope variable to enable/disable EMDR form version
                                        $scope.formVersionDisabled = reqResult.isEMDRFormVersionDisabled;
                                        if($scope.isFromEMDRConsole){
                                            var url = '/'+id.substring(0,15)+'?isdtp=mn';
                                            if (lexUtil.inLEX()) {
                                                // logic to open in lightning experience
                                                lexUtil.lexNavigateToURL(url); 
                                            }
                                            else {
                                                window.open(url, trgt);
                                            } 
                                        }else if($scope.id.length == 0 || isClone){
                                            var recId = id.substring(0,15);
                                            if (lexUtil.inLEX()) {
                                                // logic to open in lightning experience
                                                lexUtil.lexNavigateToSObject(recId);
                                            } else {
                                                window.top.location.href = '/'+ recId;
                                            }
                                        }else{
                                            $scope.showWFPanel = reqResult['showWFPanel'];
                                            if($scope.showWFPanel){
                                                reloadWFPanelDiv();
                                            } 
                                            $scope.fields = reqResult['emdrData'];    
                                            $scope.oldFieldVal =   angular.copy($scope.fields);     
                                            $scope.loginForm.$setPristine();
                                            $(".multiSelect").find("button").removeClass("ng-dirty");
                                        }
                                    }else{
                                        errorMessages = reqResult;    
                                        $scope.globalError = true;
                                        $scope.isSubmitted = true;
                                        var fldLabel = errorMessages['FieldLabel'];
                                        $scope.pageLabelErrorMessage = errorMessages['PageLabel'];
                                        for(var key in fldLabel){
                                            $scope.fields[key].message = fldLabel[key];
                                        }                                   
                                    }
                               }else{
                                    if(reqResult.message != null){
                                        $scope.exceptionMsg = reqResult.message.indexOf("Attempt to de-reference a null object") > -1 ? 'config' : reqResult.message ;
										$scope.exceptionMsg = $scope.exceptionMsg.indexOf('Invalid') > -1  ? $scope.exceptionMsg.substring($scope.exceptionMsg.indexOf("Invalid")) : $scope.exceptionMsg;
                                        $scope.exceptionMsg = ($scope.exceptionMsg.indexOf('Error') > -1 || $scope.exceptionMsg.indexOf('error') > -1) ? $scope.exceptionMsg.substring($scope.exceptionMsg.indexOf(":")+1) : $scope.exceptionMsg;
                                       
                                    }
                               }
                           },function(){});                   
                         
                         };
                          
                         $scope.filterTab = function(){
                                var searchValue = document.getElementById("search").value;
                                if(searchValue.length > 0){
                                    for(var a=0;a<$scope.tabs.length;a++){
                                        var Appfeature = $filter('filter')($scope.tabs[a].fieldList,{label:searchValue});
                                        if(Appfeature.length > 0){
                                            $scope.tabs[a].searchResult = true;
                                        }else
                                            $scope.tabs[a].searchResult = false;
                                        
                                    }
                                }
                          };  
                      
                          
                        $scope.openRelatedListNewButton = function(keyCode, target, relatedName, relatedFieldAPIName) {
                            keyCode = keyCode.replace('recordid',$scope.id);
                            keyCode = keyCode.indexOf('recordid') > -1 ?  keyCode.replace('recordid',$scope.id) : keyCode;
                            keyCode = keyCode.replace('recordName',emdrName);
                            if (lexUtil.inLEX()) {
                                if (isUndefinedOrEmpty(relatedName) && relatedName.toLowerCase() == 'note') {
                                    createNoteModal();
                                } else if (isUndefinedOrEmpty(relatedName) && isUndefinedOrEmpty(relatedFieldAPIName) 
                                        && relatedFieldAPIName != 'ParentId' && relatedFieldAPIName != 'WhatId') {
                                    var defaults = {};
                                    defaults[relatedFieldAPIName] = $scope.id;
                                    lexUtil.createRecord(relatedName,null,defaults);
                                } else {
                                    lexUtil.lexNavigateToURL(keyCode);
                                }
                            } else if (lexUtil.inConsole()) {
                                parent.top.location.href =  "/"+keyCode;
                            } else {
                                if(target) {
                                    window.top.location.href = keyCode;
                                } else {
                                    window.open(keyCode,'_blank');
                                }
                            }     
                            
                            function isUndefinedOrEmpty(item) {
                                return item != undefined && item != "";
                            }
                        };   
                        
                        $scope.parseObj = function(obj){
                            return JSON.parse(obj);
                        };
                        
                        $scope.removeCode = function(index,obj,reqObj){
                           if(obj.id.length > 0)
                                 obj.action = 'D';
                           else
                              reqObj.splice(index,1);
                        };             
                        $scope.openCodePopup = function(codeType,order,fieldOrder,index,apiName){
                            var modalInstance = $modal.open({
                            templateUrl: 'CodePopUp.html',
                            controller: 'OpenCodePopupController',
                            backdrop: "static",
                            windowClass:'codePopup',
                            size: 'lg',
                            resolve: {
                                Code:function(){
                                    return codeType;
                                },
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            if(Object.keys(selectedItem).length >0){
                                $scope.changeTabColor(order);
                                $(".panel-body"+order+fieldOrder).addClass("ng-dirty");
                                var reqObj = angular.copy(selectedItem);
                                if($scope.fields[apiName].cCodes.length > 0){
                                     var result = $filter('filter')($scope.fields[apiName].cCodes[index].codes,{'code':reqObj.code});
                                     if(result.length == 0){
                                         $scope.fields[apiName].cCodes[index].codes.push(reqObj);
                                     }else if(result[0].action == 'D'){
                                          result[0].action ='';
                                     }
                                }else{
                                   scope.fields[apiName].cCodes[index].codes.push(reqObj);
                                }
                                $scope.loginForm.$dirty= true;    
                            }
                            
                        },function(){});
                      };
                      
                    });
                    
                    app.controller("SaveController",function($scope,$modalInstance,saveRecord,tab,id, emdrVersionFormat){                       
                        $scope.selected = {
                            reqResult:'',                           
                        };
                        
                        $scope.recordDetails = {};
                        var recordDet = {};
                        recordDet.recId = id;
                        recordDet.recType = recType;
                        recordDet.isClone = cloneId != null && cloneId != '' ? '1' : '0';
                        recordDet.cloneId = cloneId;
                        recordDet.emdrVersionFormat = emdrVersionFormat;
                        $scope.recordDetails = recordDet;

                        
                        saveRecord(saveEMDR,angular.toJson(tab), JSON.stringify($scope.recordDetails)).then(function(result){
                            $scope.selected.reqResult = result;
                            $modalInstance.close($scope.selected.reqResult);
                        },function(result){
                            $scope.selected.reqResult = result;
                            $modalInstance.close($scope.selected.reqResult);
                        });
                    
                    });
                    
                    
                    app.controller('OpenCodePopupController',function($scope,$modalInstance,remoteCallTripleParamter,Code){
                        $scope.selected = {
                            item: '',
                           
                        };
                        selectedCodeType = {};
                        $scope.title = Code;
                        complaintCodeList(Code,'');
                        $scope.complaintCodeList = function(type,search){
                            complaintCodeList(type,search);
                        };
                        $scope.cancel = function () {
                            $(".ui-autocomplete").css('display','none');
                            $modalInstance.dismiss('cancel');
                        };
                        
                        $scope.save = function(){
                            $scope.selected.item = selectedCodeType;
                            $(".ui-autocomplete").css('display','none');
                            $modalInstance.close($scope.selected.item);
                        };   
                        $scope.enableSearchOption = function(obj){
                            if(obj.target.value.length > 2)
                                $scope.disablesSearch = true;
                             else
                                $scope.disablesSearch = false;      
                        
                        };
                        
                        function complaintCodeList(codeType,search){
                             remoteCallTripleParamter(codeList,codeType,search).then(function(result){
                                $scope.keySet  = JSON.parse(htmlDecode(result));
                                createTypeAhead($scope.keySet,codeType);  
                            });
                        }
                    });
                    
                    function htmlDecode(input){
                        var e = document.createElement('div');
                        e.innerHTML = input;
                        return e.textContent;
                    } 
                     
                    function createTypeAhead(codeMapArrey,codeType){                         
                        $("#selectedCode").autocomplete({
                            source:codeMapArrey,
                            select:function(event,ui){
                                $(".loadingLyer").show();
                                    callController(ui.item.value,codeType);
                                $("#selectedCode").val( ui.item.label );
                                return false;
                            },
                            minLength: 0
                        }); 
                        $("#selectedCode").autocomplete( "search","");
                    } 
                    
                    var selectedComplCodeTitle='';
                    var selectedComplCodeId =''; 
                    var selectedCodeType= {};   
                    
                    function createTree(result){  
                        $("#tree").empty(); 
                        $("#tree").dynatree({
                        onActivate: function(node) {
                            $(".expandAll").hide();                       
                            selectedCodeType.id = '';
                            selectedCodeType.code = $("<div />").html(node.data.title).text();
                            selectedCodeType.action = 'C';
                            selectedCodeType.ccid = node.data.key;
                        },
                        persist: false,
                        checkbox: false,
                        generateIds: false,
                        onFocus: null,
                        isFolder:true,
                        classNames: {
                            checkbox: "dynatree-checkbox",
                            expanded: "dynatree-expanded"
                        
                        },
                        selectMode: 3,
                        children: result,
                        minExpandLevel: 2,
                        onSelect: function(select, node) {
                            var selKeys = $.map(node.tree.getSelectedNodes(), function(node){
                                return node.data.key;
                            });
                            jQuery(document.getElementById("{!$Component.selectedKeys}")).val(selKeys.join(", "));
                            var selRootNodes = node.tree.getSelectedNodes(true);
                            var selRootKeys = $.map(selRootNodes, function(node){
                                return node.data.key;
                            });
                        },
                        
                    
                    }); 
                    $("#tree").dynatree("getRoot").visit(function(node){
                        node.expand(false);
                    }); 
                    
                    }  
                    function callController(selectedCodeId,type){
                        Visualforce.remoting.Manager.invokeAction(treeJson,selectedCodeId,type,function(result,event){
                            if(event.status){
                                createTree(JSON.parse($("<div />").html(result).text()));   
                                $(".loadingLyer").hide();
                            }else{
                            } 
                        },{escape:true});
                    
                    } 
                    
                    
                    function reloadWFPanelDiv(){
                        $("#wfdetails").empty();
                        getWFSteps();
                    }
                    
                    function clearLocalStorage(){
                        localStorage.clear();
                        window.location.reload();
                    }

                    function createNoteModal() {
                        var modal = document.getElementById('noteRelatedModal');
                        modal.style.display = "block";
                    }

                    function closeNoteModal() {
                        var modal = document.getElementById('noteRelatedModal');
                        modal.style.display = "none";
                    }