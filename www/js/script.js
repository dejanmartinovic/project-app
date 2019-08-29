var connectionStatus = false;
let slideSpeed = 130;
let webApi = "http://webserv.yooblycrm.com/?";
let redactorEmailInstance;
let emailTemplates, hiddenEmailTemplates;
let htmlBodyScroll;
let listenerLoop=0;

var FUNC = {

	init: function() {


			//var attachFastClick = Origami.fastclick;
			//attachFastClick(document.body);

			connectionStatus = navigator.onLine ? 'online' : 'offline';
			//alert(connectionStatus);

			//console.log(window.cordova);

			// check if what phone is being used.
			// if (window.cordova.platformId == "android") { // if phone used is not ios. hide the status bar background div
			// 	$(".for-status-bar").hide();
			// } else { // if phone is iOs, show the div for status bar
			// 	$(".for-status-bar").show();
			// }

			//console.log(localStorage.getItem('uid'));
			$("#uid").val(localStorage.getItem('uid'));

			//start universal footer nav
			$("[data-role='navbar']").navbar();
			$("[data-role='footer']").toolbar({theme: "a"});

			var hash = location.hash.substr(1);
			//console.log(hash);
			if (hash == "login" || hash == "") {
                //$("div[data-role=footer]").slideToggle(200);
                $("div[data-role=footer]").hide();
            } else {
            	$("div[data-role=footer]").show();
            }

			// $.event.special.tap = {
			//   setup: function() {
			//     var self = this,
			//       $self = $(self);

			//     $self.on('touchstart', function(startEvent) {
			//       var target = startEvent.target;

			//       $self.one('touchend', function(endEvent) {
			//         if (target == endEvent.target) {
			//           $.event.simulate('tap', self, endEvent);
			//         }
			//       });
			//     });
			//   }
			// };

			$('#universal-footer ul li a').on('tap', function() {
				//console.log($(this));
				var $self = $(this);
				$.mobile.defaultPageTransition = 'none';
				$self.one('webkitAnimationEnd', function() {
					$self.removeClass('pulse');
				}).addClass('pulse');
			});


			$('.ui-btn').on('tap', function() {
				//console.log($(this));
				var $self = $(this);
				$.mobile.defaultPageTransition = 'none';
				$self.one('webkitAnimationEnd', function() {
					$self.removeClass('pulse');
				}).addClass('pulse');
			});

			$( window ).on( 'hashchange', function( e ) {
				var hash = location.hash.substr(1);
				$("#universal-footer ul li a").each(function(){
					//console.log("href : "+$(this).attr("data-href"));
					var page_id = $(this).attr("data-href");
					if (hash == page_id) {
						//$(this).attr("style","background:#ccc");
						$(this).addClass(" ui-btn-active ui-state-persist");
					} else {
						//$(this).attr("style"," ");
						$(this).removeClass(" ui-btn-active ui-state-persist");
					}

				});
			} );


			//hide the footer when input is active
			var _originalSize = $(window).width() + $(window).height()
			  $(window).resize(function(){
			    if($(window).width() + $(window).height() != _originalSize){
			      //alert("keyboard show up");
			      $.mobile.activePage.find("div[data-role='footer']").hide();
			      $("#universal-footer").css({"opacity":"0", "visibility":"hidden"});
			      //$("#universal-footer").attr("style","position:absolute");
			    }else{
			      //alert("keyboard closed");
			      $.mobile.activePage.find("div[data-role='footer']").show();
			      $("#universal-footer").css({"opacity":"1", "visibility":"visible"});
			    }
			  });

			FUNC.user.checkUser();
			FUNC.user.getCampaigns();
			FUNC.user.getGroups();
			FUNC.navigation.footerNavbarInit();
			FUNC.sync.syncContact();
			FUNC.email.init();
			FUNC.user.userSettingsPage();
			//$('#contact_table').DataTable();

			//localStorage.removeItem('contacts');
			//console.log(localStorage.getItem('campaigns'));


	},

	sync: {

		syncContact: function() {

		},

		addOfflineContact: function() {

			if (localStorage.getItem('offline_contacts') !== null) {

				var offlineContacts = localStorage.getItem('offline_contacts');
				var parsedContacts = JSON.stringify(offlineContacts);

				//console.log(offlineContacts);

				$.ajax({
			          type: "POST",
			          url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=sync_contact&uid="+localStorage.getItem('uid'),
			          data: {mydata : offlineContacts},
			          dataType: "json",
			          success: function(response){
			          	console.log(response);

			        }
			        ,
			        error: function(jqXHR, textStatus, errorThrown)
			        {
			            //alert("Fail!");
			        }
			    });
			}

		},

		removeOfflineContact: function() {

			if (localStorage.getItem('offline_contacts_delete') !== null) {

				var offlineContacts = localStorage.getItem('offline_contacts_delete');
				var parsedContacts = JSON.stringify(offlineContacts);

				console.log(offlineContacts);

				$.ajax({
			          type: "POST",
			          url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=sync_contact_delete&uid="+localStorage.getItem('uid'),
			          data: {mydata : offlineContacts},
			          dataType: "json",
			          success: function(response){
			          	console.log(response);

			            //window.location.href = "/index.php";
			        }
			        ,
			        error: function(jqXHR, textStatus, errorThrown)
			        {
			            //alert("Fail!");
			        }
			    });

			}

		}

	},

	navigation: {
		footerNavbarInit: function() {
			$("[data-role='page']").each(function(){
				var hash = location.hash.substr(1);
				//console.log("id : "+$(this).attr("id"));
				var page_id = $(this).attr("id");
				if (hash == page_id) {
					//$(this).attr("style","background:#ccc");
					$("#page_"+hash).addClass(" ui-btn-active ui-state-persist");
				} else {
					//$(this).attr("style"," ");
					//$("#universal-footer ul li a").removeClass(" ui-btn-active ui-state-persist");
				}

			});
		}
	},
	user: {

		getTodaysTask: function() {
			//console.log("hey");
	        $.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=user_tasks&uid="+localStorage.getItem('uid'),
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	//console.log("task : "+response);
	            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';

	            	//if (response.length > 0) {

	            		localStorage.setItem('todays_task', JSON.stringify(response));

		            	setTimeout(function(){
		            		FUNC.user.showTodaysTask();
		            	},200);

	            	// } else {

	            	// 	$("#todays_content_wrapper").html("<div class='noff'><center><h1>You have no more<br>follow-ups for today.</h1></center><br><img src='images/like.png' width='100' style='margin-top: 100px;'/></div>");

	            	// }
	            }
	        });

		},

		userSettingsPage: function() {

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=user_info&uid="+localStorage.getItem('uid'),
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	console.log(response);

	            	$(".user_fname").val(response.first_name);
	            	$(".user_lname").val(response.last_name);
	            	$(".user_email").val(response.email);

	            	$(".user_address").val(response.address);
	            	$(".user_city").val(response.city);
	            	$(".user_state").val(response.state);
	            	$(".user_zip").val(response.zip);

	            	$(".user_website").val(response.website);
	            	$(".user_company").val(response.company);
	            	$(".user_facebook_url").val(response.facebook_url);
	            	$(".user_notif_email").val(response.notif_email);
	            	$(".user_phone").val(response.phone);


	            }
	        });

		},

		showTodaysTask: function() {

			//console.log("todays task : "+localStorage.getItem('todays_task'));

			if (typeof localStorage.getItem('todays_task') !== 'undefined' && localStorage.getItem('todays_task') !== null) {

				//console.log("todays_task is not null");
				var div_task_content = "";
				var todays_task = localStorage.getItem('todays_task');
				var parsedContactsTask = JSON.parse(todays_task);

				//console.log("test : "+parsedContactsTask);

				$.each(parsedContactsTask, function(i, task) {
					//console.log(parsedContactsTask[task]);

					$.each(task, function(k, call) {
						//console.log(call.length);

			        	for(var i = 0; i < call.length; i++) {
							if(call[i].contact.cid != null){
								//console.log(call[i].contact.first_name);

								var timestampInMilliSeconds = call[i].date*1000;
								var date = new Date(timestampInMilliSeconds);

								var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
								var month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
								var year = date.getFullYear();

								var hours = ((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12);
								var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
								var meridiem = (date.getHours() >= 12) ? 'pm' : 'am';

								var formattedDate = day + '-' + month + '-' + year;

								div_task_content += "<ul id='div-"+call[i].contact.cid+"' class='listcontactwrapper'>";
								//div_task_content += "<div class='contactcheck align-left'><label class='contactcheckwrap'><input type='checkbox' value='"+call[i].contact.cid+"' id='' name='checked_contact[]' class='contact-checkbox'/><span class='checkmark'></span></label></div>";
								name = "";
								console.log(call[i].contact.first_name);
								console.log(typeof call[i].contact.first_name);
								if(call[i].contact.first_name != null ) name += call[i].contact.first_name+ " ";
								if(call[i].contact.last_name != null ) name += call[i].contact.last_name;


								if(name =="") name = "<i>No Name</i>";

								div_task_content += "<div class='align-left contact_info '  style='padding-left: 10%;'>";
								div_task_content += "<li><h1><a href='#' class='contact_details contact_details_prospect' style='float:none' data-cid='"+call[i].contact.cid+"'>"+name+"</a></h1></li>";
								div_task_content += "<li>"+k+" - "+formattedDate+"</li>";
								//div_task_content += "<li>"+call[i].contact.phone+"</li>";

								div_task_content += "</div></ul>";
							}

			        	}

				    });

			    });

				$("#todays_content").html(div_task_content);
			}



		},

		showContactDetails: function(cid) {

			//alert(".contact-list-"+cid);
			var contact_cpgid;
			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				var contact_details_content = "";
				var contact_cid = "";
				var contact_name = "";
				var contact_email = "";
				var contact_group = "";
				var contact_campaign_name = "";
				var contact_group_name = "";
				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {
						contact_cid = contacts[i].cid;
						contact_name = contacts[i].first_name;
						contact_email = contacts[i].email;

						contact_details_content += `<div class="headercampaign">
													<div class="prospectheader-fixed" style="background: #31bfcb;height: 30px;">
														<ul style="padding:0;">
															<li style="text-align: left;">
																<a style="color:#fff" data-mini="true" data-container="dynamic_dialog" class="textwhite"><img src="images/backarrow.png" width="10"> Back</a>
															</li>
															<li class="textwhite"></li>
															<li style="float: right;padding: 10px 15px;text-align: right;"></li>
														</ul>
													</div>`;

						contact_details_content += "<div style='overflow:auto; max-height:83vh; overscroll-behavior: none; -webkit-overflow-scrolling: touch; '>";
						contact_details_content += "<div id='result-group-camp-update'></div>";
						//contact_details_content += '<a href="#prospect" data-mini="true" data-container="dynamic_dialog" class="ui-btn custom_btn paddingleftright" style="background: #31bfcb;text-shadow: none;color: #fff;padding-bottom: 12px !important; margin-bottom: 0;">Cancel</a>';
						contact_details_content += "<div class='subtlegray'><div class='contactname'><h1>"+contacts[i].first_name+" "+contacts[i].last_name+"</h1></div>";
						contact_details_content += "<div class='contactemail'>"+contacts[i].email+"</div>";
						contact_details_content += "<div class='contactaddress'>"+contacts[i].address+"</div>";
						contact_details_content += "<div class='iconwrappercontact' data-role='none'>";
						contact_details_content += `<div class='iconscontacts' data-role='none' align-left' style='margin-left: 17px;'>
														<a href="tel:${contacts[i].phone}">
															<img src='images/phoneicon.png' width='40'/>
														</a>
														<span>Call</span>
													</div>`;
						contact_details_content += `<div class='iconscontacts open_sms_btn' data-role='none' align-left'>
														<a href="sms:${contacts[i].phone}">
															<img src='images/chaticon.png' width='40'/>
															<span>Text</span>
														</a>
													</div>`;
						contact_details_content += `<button type="button" data-role='none' class="iconscontacts align-left contact-email-composer-btn" data-email="${contacts[i].email}"><img src='images/emailicon.png' width='40'/><span>Email</span></button>`;
						contact_details_content += "<div data-role='none' class='iconscontacts align-left edit_contact_btn' data-cid='"+contacts[i].cid+"'><img src='images/editicon.png' width='40'/><span>Edit</span></div>";
						contact_details_content += "</div></div>";

						if (typeof contacts[i].cp_gid !== 'undefined' && contacts[i].cp_gid !== null) {

							contact_cpgid = contacts[i].cp_gid;
							var retrievedContactsCamapigns = localStorage.getItem('campaigns');
							var contactsCampaigns = JSON.parse(retrievedContactsCamapigns);

							for (f = 0; f < contactsCampaigns.length; f++) {

								if (contacts[i].cp_gid == contactsCampaigns[f].cp_gid) {

									contact_campaign_name = contactsCampaigns[f].name;

								}

							}

						} else {
							contact_cpgid = 0;
						}

						//console.log(contacts[i].groups);

						if (typeof contacts[i].groups !== 'undefined' && contacts[i].groups !== null) {

							//contact_cpgid = contacts[i].cp_gid;
							//var retrievedContactsGroups = contacts[i].groups;
							//var contactsGroups = JSON.parse(retrievedContactsGroups);

							for (g = 0; g < contacts[i].groups.length; g++) {

								contact_group_name += "<span class='group_names'>"+contacts[i].groups[g].name+"</span><br /> ";

							}

						} else {
							contact_group_name = "Group Names";
						}

						contact_details_content += '<div class="formfield heightfortytwo campaignclick">';
						contact_details_content += "<div style='text-align: left;'><span>Select Campaign</span><a href='#' style='text-align: right;float: right;' class='edit_contact_area_campaign-btn' data-cp_gid='"+contact_cpgid+"' data-cid='"+contacts[i].cid+"' style='font-size:20px;float: right;'> <span>"+contact_campaign_name+"</span> <img src='images/rightarrow.png' width='10' class='marginimg'/></a></div>";
						contact_details_content += '</div>';

						contact_details_content += '<div class="formfield heightfortytwo">';
						contact_details_content += "<div style='text-align: left;'><span>Select Groups</span><a href='#' style='text-align: right;float: right;' class='edit_contact_area_group-btn' data-cid='"+contacts[i].cid+"'> <span style='display: inline-table; margin-right: 0;margin-bottom: 10px;'>"+contact_group_name+"</span> <img src='images/rightarrow.png' width='10' style='float: right;' class='marginimg'/></a></div>";
						contact_details_content += '</div>';

						//contact_details_content += "<div>Appointments</div>";
						//contact_details_content += "<div>Email</div>";
						contact_details_content += "<div class='clearfix'></div>";

						contact_details_content += "<div id='contact_tasks' class='paddingleftright' style='text-align:left;'>";
						contact_details_content += "<h4 style='width: 50%;float: left;margin-bottom:10px;'>Tasks</h4>";
						contact_details_content += "<button class=\"add-task-btn\" data-role='none' data-cid='"+contacts[i].cid+"' type=\"button\" data-mini=\"true\" class=\"custom_btn\" style='width: 10%;float: right;text-align:center;box-shadow: none;margin: 5px 0;'> <img src='images/add.png' class='alignright' width='18'> </button>";
						contact_details_content += "<div id='contact_tasks_content'>";
						contact_details_content += "</div>";
						contact_details_content += "</div>";

						contact_details_content += "<div id='contact_notes' class='paddingleftright' style='text-align:left;clear: both;'>";
						contact_details_content += "<h4 style='width: 50%;float: left;margin-bottom:10px;'>Notes</h4>";
						contact_details_content += "<button class=\"add-note-btn\" data-role='none' data-cid='"+contacts[i].cid+"' type=\"button\" data-mini=\"true\" class=\"custom_btn\" style='width: 10%;float: right;text-align:center;box-shadow: none;margin: 5px 0;'> <img src='images/add.png' class='alignright' width='18'> </button>";
						contact_details_content += "<div id='contact_notes_content'>";
						contact_details_content += "</div>";
						contact_details_content += "</div>";
						//contact_details_content += '<button id="contact-email-composer-btn" class="ui-btn">Email</button>';



						contact_details_content += `

								<div class="contact-history" class='paddingleftright' style="clear:both;text-align: left;padding-bottom: 20px;">

										<h4>History</h4>
										<div class="contact-history-container"></div>

								</div>
							</div>
						`;

						contact_details_content += "</div> ";

					}

				}

				//console.log(contact_details_content);

				setTimeout(function(){

					FUNC.contact.contactDetails(cid);
					FUNC.contact.getHistory(cid, ".contact-history-container");

				},50);

				$("#dynamic_dialog .dialog_content div").html(contact_details_content);


				leftDialog = $("#dynamic_dialog").css("margin-left");
				if(leftDialog != "0px"){
					$("#dynamic_dialog").animate({
						marginLeft: '-=100%'
					}, slideSpeed);
				}


				/*
				$.mobile.changePage("#dynamic_dialog", {
										transition: 'none',
										changeHash: true,
										role: 'dialog'
									});
				*/


			}

		},

		showContactDetailsTask: function(cid) {

			var contact_cpgid;
			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				var contact_details_content = "";
				var contact_cid = "";
				var contact_name = "";
				var contact_email = "";
				var contact_group = "";
				var contact_campaign_name = "";
				var contact_group_name = "";
				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {
						contact_cid = contacts[i].cid;
						contact_name = contacts[i].first_name;
						contact_email = contacts[i].email;


						contact_details_content += "<div id='result-group-camp-update'></div>";
						contact_details_content += '<a href="#today" data-mini="true" data-container="dynamic_dialog" class="ui-btn custom_btn paddingleftright" style="background: #31bfcb;text-shadow: none;color: #fff;padding-bottom: 12px !important;">Cancel</a>';
						contact_details_content += "<div class='subtlegray'><div class='contactname'><h1>"+contacts[i].first_name+" "+contacts[i].last_name+"</h1></div>";
						contact_details_content += "<div class='contactemail'>"+contacts[i].email+"</div>";
						contact_details_content += "<div class='contactaddress'>"+contacts[i].address+"</div>";
						contact_details_content += "<div class='iconwrappercontact' data-role='none'>";
						contact_details_content += "<div class='iconscontacts' data-role='none' align-left' style='margin-left: 17px;'><img src='images/phoneicon.png' width='40'/><span>Call</span></div>";
						contact_details_content += "<div class='iconscontacts' data-role='none' align-left'><img src='images/chaticon.png' width='40'/><span>Text</span></div>";
						contact_details_content += `<button type="button" data-role='none' class="iconscontacts align-left contact-email-composer-btn" data-email="${contacts[i].email}"><img src='images/emailicon.png' width='40'/><span>Email</span></button>`;
						contact_details_content += "<div data-role='none' class='iconscontacts align-left edit_contact_btn' data-cid='"+contacts[i].cid+"'><img src='images/editicon.png' width='40'/><span>Edit</span></div>";
						contact_details_content += "</div></div>";

						if (typeof contacts[i].cp_gid !== 'undefined' && contacts[i].cp_gid !== null) {

							contact_cpgid = contacts[i].cp_gid;
							var retrievedContactsCamapigns = localStorage.getItem('campaigns');
							var contactsCampaigns = JSON.parse(retrievedContactsCamapigns);

							for (f = 0; f < contactsCampaigns.length; f++) {

								if (contacts[i].cp_gid == contactsCampaigns[f].cp_gid) {

									contact_campaign_name = contactsCampaigns[f].name;

								}

							}

						} else {
							contact_cpgid = 0;
						}

						//console.log(contacts[i].groups);

						if (typeof contacts[i].groups !== 'undefined' && contacts[i].groups !== null) {

							//contact_cpgid = contacts[i].cp_gid;
							//var retrievedContactsGroups = contacts[i].groups;
							//var contactsGroups = JSON.parse(retrievedContactsGroups);

							for (g = 0; g < contacts[i].groups.length; g++) {

								contact_group_name += "<span class='group_names'>"+contacts[i].groups[g].name+"</span><br />";

							}

						} else {
							contact_group_name = "Group Names";
						}

						contact_details_content += '<div class="formfield heightfortytwo">';
						contact_details_content += "<div style='text-align: left;'><span>Select Campaign</span><a href='#' style='text-align: right;float: right;' class='edit_contact_area_campaign-btn' data-cp_gid='"+contact_cpgid+"' data-cid='"+contacts[i].cid+"' style='font-size:20px;float: right;'> <span>"+contact_campaign_name+"</span> <img src='images/rightarrow.png' width='10' class='marginimg'/></a></div>";
						contact_details_content += '</div>';

						contact_details_content += '<div class="formfield heightfortytwo">';
						contact_details_content += "<div style='text-align: left;'><span>Select Groups</span><a href='#' style='text-align: right;float: right;' class='edit_contact_area_group-btn' data-cid='"+contacts[i].cid+"'> <span style='display: inline-table;'>"+contact_group_name+"</span> <img src='images/rightarrow.png' width='10' style='float: right;' class='marginimg'/></a></div>";
						contact_details_content += '</div>';

						//contact_details_content += "<div>Appointments</div>";
						//contact_details_content += "<div>Email</div>";
						contact_details_content += "<div class='clearfix'></div>";

						contact_details_content += "<div id='contact_tasks' class='paddingleftright add-task-btn' style='text-align:left;'>";
						contact_details_content += "<h4 style='width: 50%;float: left;margin-bottom:10px;'>Tasks</h4>";
						contact_details_content += "<button class=\"add-task-btn\" data-role='none' data-cid='"+contacts[i].cid+"' type=\"button\" data-mini=\"true\" class=\"custom_btn\" style='width: 10%;float: right;text-align:center;box-shadow: none;margin: 5px 0;'> <img src='images/add.png' class='alignright' width='18'> </button>";
						contact_details_content += "<div id='contact_tasks_content'>";
						contact_details_content += "</div>";
						contact_details_content += "</div>";

						contact_details_content += "<div id='contact_notes' class='paddingleftright add-note-btn' style='text-align:left;clear: both;margin-top: 20px;'>";
						contact_details_content += "<h4 style='width: 50%;float: left;margin-bottom:10px;'>Notes</h4>";
						contact_details_content += "<button class=\"add-note-btn\" data-role='none' data-cid='"+contacts[i].cid+"' type=\"button\" data-mini=\"true\" class=\"custom_btn\" style='width: 10%;float: right;text-align:center;box-shadow: none;margin: 5px 0;'> <img src='images/add.png' class='alignright' width='18'> </button>";
						contact_details_content += "<div id='contact_notes_content'>";
						contact_details_content += "</div>";
						contact_details_content += "</div>";
						//contact_details_content += '<button id="contact-email-composer-btn" class="ui-btn">Email</button>';



						contact_details_content += `

								<div class="contact-history" class='paddingleftright' style="clear:both;margin-top: 20px;text-align: left;padding-bottom: 20px;">

										<h4>History</h4>
										<div class="contact-history-container"></div>

								</div>

						`;

					}

				}

				//console.log(contact_details_content);

				setTimeout(function(){

					FUNC.contact.contactDetails(cid);
					FUNC.contact.getHistory(cid, ".contact-history-container");

				},50);

				$("#dynamic_dialog .dialog_content div").html(contact_details_content);


				leftDialog = $("#dynamic_dialog").css("margin-left");
				if(leftDialog != "0px"){
					$("#dynamic_dialog").animate({
						marginLeft: '-=100%'
					}, slideSpeed);
				}


				/*
				$.mobile.changePage("#dynamic_dialog", {
										transition: 'none',
										changeHash: true,
										role: 'dialog'
									});
				*/


			}

		},

		editContact: function(cid, page_from = null) {


			if (page_from != null) {
				page_from = "#"+page_from;
			} else {
				page_from = "#prospect";
			}

			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				console.log(cid);

				var edit_contact_content = "";
				var contact_email = "";
				var contact_campaign_name = "";
				var contact_group_name = "";
				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {
						console.log(contacts[i]);
						contact_email = contacts[i].email;

						edit_contact_content += '<div id="contact-form">';
						edit_contact_content += '<form id="edit-contact-form" method="POST" action="#"  data-ajax="false">';
					//	edit_contact_content += '<div id="topheaderform" style="position:unset;">';
					//	edit_contact_content += '<ul class="editcontactheader">';
					//	edit_contact_content += '<li style="padding:0;"><a href="#prospect" data-mini="true" data-container="dynamic_page" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/> Back</a></li>';
					//	edit_contact_content += '<li>Edit Contact</li>';
					//	edit_contact_content += '<li><input id="save-contact-btn" type="button" data-mini="true" class="" name="" value="Save"></li>';
				//		edit_contact_content += '</ul>';
					//	edit_contact_content += '</div>';
						edit_contact_content += '<div id="formwrapper" style="padding: 0 0 50px 0 !important;  margin-top: 70px;">';

						edit_contact_content += '<div id="result-edit-contact"></div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="hidden" id="cid" name="cid" placeholder="First Name" value="'+contacts[i].cid+'">';
						edit_contact_content += '<input type="text" id="first_name" name="first_name" placeholder="First Name" value="'+contacts[i].first_name+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="last_name" name="last_name" placeholder="Last Name" value="'+contacts[i].last_name+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="email" name="email" placeholder="Email" value="'+contacts[i].email+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="phone" name="phone" placeholder="Phone" value="'+contacts[i].phone+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="address" name="address" placeholder="Address" value="'+contacts[i].address+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="city" name="city" placeholder="City" value="'+contacts[i].city+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="state" name="state" placeholder="State" value="'+contacts[i].state+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="zip" name="zip" placeholder="Zip" value="'+contacts[i].zip+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield">';
						edit_contact_content += '<input type="text" id="website" name="website" placeholder="Website" value="'+contacts[i].website+'">';
						edit_contact_content += '</div>';

						if (typeof contacts[i].cp_gid !== 'undefined' && contacts[i].cp_gid !== null) {

							var retrievedContactsCamapigns = localStorage.getItem('campaigns');
							var contactsCampaigns = JSON.parse(retrievedContactsCamapigns);

							for (f = 0; f < contactsCampaigns.length; f++) {

								if (contacts[i].cp_gid == contactsCampaigns[f].cp_gid) {

									contact_campaign_name = contactsCampaigns[f].name;

								}

							}

						}

						if (typeof contacts[i].groups !== 'undefined' && contacts[i].groups !== null) {

							//contact_cpgid = contacts[i].cp_gid;
							//var retrievedContactsGroups = contacts[i].groups;
							//var contactsGroups = JSON.parse(retrievedContactsGroups);

							for (g = 0; g < contacts[i].groups.length; g++) {

								contact_group_name += "<span class='group_names'>"+contacts[i].groups[g].name+"</span><br />";

							}

						} else {
							contact_group_name = "Group Names";
						}

						edit_contact_content += '<div class="formfield heightfortytwo">';
						edit_contact_content += "<div style='text-align: left;'><span>Select Campaign</span><a href='#' class='edit_contact_campaign-btn' data-cp_gid='"+contacts[i].cp_gid+"' data-cid='"+contacts[i].cid+"' style='font-size:20px;float: right;'> <span>"+contact_campaign_name+"</span> <img src='images/rightarrow.png' width='10'/></a></div>";
						edit_contact_content += '</div>';

						edit_contact_content += '<div class="formfield heightfortytwo">';
						edit_contact_content += "<div style='text-align: left;'><span>Select Groups</span><a href='#' style='text-align: right;float: right;' class='edit_contact_area_group-btn' data-cid='"+contacts[i].cid+"'> <span style='display: inline-table;'>"+contact_group_name+"</span> <img src='images/rightarrow.png' width='10' style='float: right;' /></a></div>";
						edit_contact_content += '</div>';
						edit_contact_content += '<div class="buttonbacksave">';
						edit_contact_content += '<div class="alignleft halfwidth"><a href="#prospect" data-mini="true" data-container="dynamic_page" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/> Back</a></div>';
						edit_contact_content += '<div class="alignleft halfwidth savebtneditcontact" style="padding: 10px;"><input id="save-contact-btn" type="button" data-mini="true" class="" name="" value="Save"></div>';
						edit_contact_content += '</div>';
						edit_contact_content += '</div>';
						edit_contact_content += '</form>';
						edit_contact_content += '</>';

					}

				}

				// $("#dynamic_dialog .dialog_content div").html(edit_contact_content);
				$("#dynamic_page #dialog_page_content div").html(edit_contact_content);
				$("#dynamic_page").animate({
					marginLeft: '-=100%'
				}, slideSpeed);


	            /*$.mobile.changePage("#dynamic_dialog", {
							            transition: 'none',
							            changeHash: true,
							            role: 'dialog'
							        });*/

	            $("#save-contact-btn").on('tap', function(e){

	            	$.ajax({
			            type: "POST",
			            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_update&uid="+localStorage.getItem('uid')+"&cid="+$("#cid").val(),
			            data: $("#edit-contact-form").serialize(),
			            dataType: "JSON",
			            beforeSend: function() {
			            },
			            success: function(response) {

			            	if (response.success > 0) {
			            		//$("#result-edit-contact").html("Contact saved!");
			            		FUNC.contact.updateContacts();
			            	} else {
			            		//$("#result-edit-contact").html("Error updating contact.");
			            	}

			            	setTimeout(function(){
			            		$("#result-edit-contact").html("");
			            		$("#dynamic_page").animate({
									marginLeft: '+=100%'
								}, slideSpeed);
			            	},1000);

		                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

			            }
			        });

	            	e.stopImmediatePropagation();
	            });

	            // $(".edit_contact_campaign-btn").on('tap', function(e){

	            // 	e.stopImmediatePropagation();
	            // 	e.preventDefault();

	            // 	console.log(e);

	            // 	//var cp_gid = e.currentTarget.attributes[2].nodeValue;
	            // 	var cid = e.currentTarget.attributes[3].nodeValue;

	            // 	FUNC.user.editContactCampaign(cid);
	            // });
			}

		},

		editContactCampaign: function(cid) {

			var contact_cpgid;
			var campaign_cpgid;

			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				var edit_contact_campaign = "";

				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				edit_contact_campaign += `<div class="headercampaign">
												<div id="topheaderform" >
													<ul style="padding-top:0;">
														<li class="textwhite" style="width: 100%;">
															Campaign
														</li>
													</ul>
												</div>
												<div class="result-group-camp-update"></div>`;

				edit_contact_campaign += "<form id='change_campaign' method='POST' action='' data-ajax='false'>";
				edit_contact_campaign += "<input type='hidden' name='edit-contact_cid' value='"+cid+"'>";

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {

						edit_contact_campaign += '<input type=\'hidden\' id="contact-campaign-hdn-selected-'+contacts[i].cp_gid+'" name=\'contact-campaign-hdn-selected-cp_gid\' value="'+contacts[i].cp_gid+'">';

						var retrievedCampaigns = localStorage.getItem('campaigns');
						var campaigns = JSON.parse(retrievedCampaigns);
						contact_cpgid = contacts[i].cp_gid;

						for (j = 0; j < campaigns.length; j++) {

							campaign_cpgid = campaigns[j].cp_gid;

							edit_contact_campaign += '<div class="formfield campaigncheck">';
							edit_contact_campaign += '<label class="campaignlabel" data-role="none"><span class="campname" for="contact-campaign-'+campaigns[j].cp_gid+'">'+campaigns[j].name+'</span>';
							edit_contact_campaign += '<input id="contact-campaign-'+campaigns[j].cp_gid+'" type="checkbox" name="edit-cp_gid" value="'+campaigns[j].cp_gid+'" style="float: right;position: unset;" class="selectone contact_campaign"><span class="checkmarkcampaign"></span></label>';
							edit_contact_campaign += '</div>';

						}

						edit_contact_campaign += '<div class="buttonbacksave">';
						edit_contact_campaign += '<div class="alignleft halfwidth"><a href="#prospect" data-mini="true" data-container="edit_contact_camp_group_page" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/> Back</a></div>';
						edit_contact_campaign += '<div class="alignleft halfwidth savebtneditcontact" style="padding: 10px;width: 155px;"><input id="update-contact-campaign-btn" type="button" data-mini="true" class="" name="" value="Save"></div>';
						edit_contact_campaign += '</div>';

					}

				}

				edit_contact_campaign += "</form>";
				edit_contact_campaign += '</div>';

				$("#edit_contact_camp_group_page #edit_camp_group_page div").html(edit_contact_campaign);
				$("#edit_contact_camp_group_page").animate({
					marginLeft: '-=100%'
				}, slideSpeed);

				$('.contact_campaign').each(function() {
					selected_cpgid = $(this).val();

				    //console.log(selected_cpgid+" : "+$("#contact-campaign-hdn-selected-"+selected_cpgid).val());

				    if ($("#contact-campaign-hdn-selected-"+selected_cpgid).length > 0) {
				    	$(this).prop("checked", true);
				    }
				});

				$('.contact_campaign').on('change', function() {
				    $('.contact_campaign').not(this).prop('checked', false);
				});

	            /*$.mobile.changePage("#dynamic_page", {
							            transition: 'none',
							            changeHash: true,
							            role: 'page'
							        });*/


	            $("#update-contact-campaign-btn").on('tap', function(e){

	            	e.stopImmediatePropagation();
	            	e.preventDefault();

	            	console.log($("#change_campaign").serialize());

	            	$.ajax({
			            type: "POST",
			            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=campaigns_update&uid="+localStorage.getItem('uid'),
			            data: $("#change_campaign").serialize(),
			            dataType: "JSON",
			            beforeSend: function() {
			            },
			            success: function(response) {



			            	if (response.success > 0) {
								//$(".result-group-camp-update").html("<div style='color:#3fbfca'>Campaign saved!</div>");
								//FUNC.user.showContactDetails(cid);
								FUNC.contact.updateContacts();
								//update list
								//setTimeout(function(){
										//FUNC.user.editContact(cid);


								//},1000);
								setTimeout(function(){
									campaignName = $(".selectone.contact_campaign:checked").parent().find(".campname").html();
									$(".edit_contact_area_campaign-btn span").html(campaignName);
									//alert($(".edit_contact_area_campaign-btn span").html());
									$("#edit_contact_camp_group_page").animate({
										marginLeft: '+=100%'
									}, slideSpeed);
								}, 200);

							} else {
								$(".result-group-camp-update").html("Error updating contact campaign.");
							}

			            	setTimeout(function(){
			            		$(".result-group-camp-update").html("");
			            	},1000);

		                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

			            }
			        });
	            });
			}

		},

		editContactGroups: function(cid) {

			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				var edit_contact_group = "";

				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				edit_contact_group += `<div class="headercampaign editcontactgroupheader">
												<div id="topheaderform">
													<ul style="padding-top:0;text-align:center;padding-bottom:10px;">
														<li style="width:100%;">
															Group
														</li>
													</ul>
												</div>
												<div class="result-group-group-update"></div>`;

				edit_contact_group += "<form id='change_group' method='POST' action='' data-ajax='false'>";
				edit_contact_group += "<input type='hidden' name='cid' value='"+cid+"'>";

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {

						var retrievedGroups = localStorage.getItem('groups');
						var groups = JSON.parse(retrievedGroups);
						//console.log(contacts[i].groups);
						if (typeof contacts[i].groups !== 'undefined' && contacts[i].groups !== null) {
							for (y = 0; y < contacts[i].groups.length; y++) {
								edit_contact_group += '<input type=\'hidden\' id="contact-group-hdn-selected-'+contacts[i].groups[y].gid+'" name=\'contact-group-hdn-selected-gid\' value="'+contacts[i].groups[y].gid+'">';
							}
						}

						for (j = 0; j < groups.length; j++) {

							if (groups[j].gid == 193 || groups[j].gid == 202 || groups[j].uid == localStorage.getItem('uid')) {


								edit_contact_group += '<div class="formfield campaigncheck">';
								edit_contact_group += '<label class="campaignlabel contact-group-label-'+groups[j].gid+'" data-role="none"><span class="campname" for="contact-campaign-'+groups[j].gid+'">'+groups[j].name+'</span>';
								edit_contact_group += '<input id="contact-group-'+groups[j].gid+'" type="checkbox" name="gid[]" value="'+groups[j].gid+'" style="float: right;position: unset;" class="selectone contact_group"><span class="checkmarkcampaign"></span></label>';
								edit_contact_group += '</div>';
							}

						}

						edit_contact_group += '<div class="buttonbacksave">';
						edit_contact_group += '<div class="alignleft halfwidth"><a href="#prospect" data-mini="true" data-container="edit_contact_camp_group_page" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/> Back</a></div>';
						edit_contact_group += '<div class="alignleft halfwidth savebtneditcontact" style="padding: 10px;width: 155px;"><input id="update-contact-group-btn" type="button" data-mini="true" class="" name="" value="Save"></div>';
						edit_contact_group += '</div>';

					}

				}

				edit_contact_group += "</form>";
				edit_contact_group += '</div>';

				$("#edit_contact_camp_group_page #edit_camp_group_page div").html(edit_contact_group);
				$("#edit_contact_camp_group_page").animate({
					marginLeft: '-=100%'
				}, slideSpeed);

				$('.contact_group').each(function() {
					selected_gid = $(this).val();

				    //console.log(selected_gid+" : "+$("#contact-group-hdn-selected-"+selected_gid).length);

				    if ($("#contact-group-hdn-selected-"+selected_gid).length > 0) {
				    	$(this).prop("checked", true);
				    }
				});


	            $("#update-contact-group-btn").on('tap', function(e){

	            	e.stopImmediatePropagation();
	            	e.preventDefault();

	            	var selected_groups = "";
	            	//console.log("http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_add_group&uid="+localStorage.getItem('uid')+$("#change_group").serialize());

	            	$.ajax({
			            type: "POST",
			            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_add_group&uid="+localStorage.getItem('uid')+'&'+$("#change_group").serialize(),
			            //data: $("#change_group").serialize(),
			            dataType: "JSON",
			            beforeSend: function() {
			            },
			            success: function(response) {

			            	console.log(response);

			            	if (response > 0) {
								//$(".result-group-group-update").html("<div style='color:#3fbfca'>Group saved!</div>");
								FUNC.contact.updateContacts();

								$(".grpnamewrap").html("");

								$(".contact_group:checked").each(function() {
									selected_groups += "<span class='group_names'>"+$(this).parent().find(".campname").html()+"</span><br />";
								});

								setTimeout(function(){
									//campaignName = $(".selectone.contact_campaign:checked").parent().find(".campname").html();
									$(".edit_contact_area_group-btn").html(selected_groups);
									//alert($(".edit_contact_area_campaign-btn span").html());
									$("#edit_contact_camp_group_page").animate({
										marginLeft: '+=100%'
									}, slideSpeed);
								}, 200);

							} else {
								$(".result-group-group-update").html("Error updating contact group.");
							}

			            	setTimeout(function(){
			            		$(".result-group-group-update").html("");
			            	},1500);

		                    $("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

			            }
			        });

	            });
			}

		},

		selectContactCampaign: function() {


				var edit_contact_campaign = "";

				edit_contact_campaign += `<div class="headercampaign">
												<div id="topheaderform" >
													<ul style="padding-top:0;">
														<li style="text-align: left;">
															<a href="#" data-mini="true" data-container="edit_contact_camp_group_page" class="" style="padding: 20px 20px 10px 20px;">Cancel</a>
														</li>
														<li>
															Campaign
														</li>
														<li style="float: right;margin-top: -19px;text-align: right;">
															<button type="button" id="select-contact-campaign-btn" style="font-family: Montserrat;padding: 20px 20px 10px 20px;">Done</button>
														</li>
													</ul>
												</div>
												<div class="result-group-camp-update"></div>`;

				edit_contact_campaign += "<form id='select_campaign' method='POST' action='' style='margin-top: 20px;' data-ajax='false'>";

				var retrievedCampaigns = localStorage.getItem('campaigns');
				var campaigns = JSON.parse(retrievedCampaigns);

				for (j = 0; j < campaigns.length; j++) {

					campaign_cpgid = campaigns[j].cp_gid;

					edit_contact_campaign += '<div class="formfield campaigncheck">';
					edit_contact_campaign += '<label class="campaignlabel" data-role="none"><span class="campname" for="contact-campaign-'+campaigns[j].cp_gid+'">'+campaigns[j].name+'</span>';
					edit_contact_campaign += '<input id="contact-campaign-'+campaigns[j].cp_gid+'" type="checkbox" name="edit-cp_gid" value="[CAMPAIGN_SELECTED]-'+campaigns[j].cp_gid+'" style="float: right;position: unset;" class="selectone contact_campaign"><span class="checkmarkcampaign"></span></label>';
					edit_contact_campaign += '</div>';

				}


				edit_contact_campaign += "</form>";
				edit_contact_campaign += '</div>';

				$("#edit_contact_camp_group_page #edit_camp_group_page div").html(edit_contact_campaign);
				$("#edit_contact_camp_group_page").animate({
					marginLeft: '-=100%'
				}, slideSpeed);

				$('.contact_campaign').on('change', function() {
				    $('.contact_campaign').not(this).prop('checked', false);
				});


	            $("#select-contact-campaign-btn").on('tap', function(e){

	            	e.stopImmediatePropagation();
	            	e.preventDefault();

	            	var chkArray = [];

					/* look for all checkboes that have a class 'chk' attached to it and check if it was checked */
					$(".contact_campaign:checked").each(function() {
						chkArray.push($(this).val());
					});

					/* we join the array separated by the comma */
					var selected;
					selected = chkArray.join(',') ;

					$("#send-email-form #email_to").val(selected);

	            	$("#edit_contact_camp_group_page").animate({
						marginLeft: '+=100%'
					}, slideSpeed);
	            });


		},

		selectContactGroups: function() {


				var edit_contact_group = "";

				edit_contact_group += `<div class="headercampaign selectcontactgroupheader">
												<div id="topheaderform" style="height:10px;">
													<ul style="padding-top:0;text-align:center;padding-bottom:10px;">
														<li style="width:100%;">
															Group
														</li>
													</ul>
												</div>
												<div class="result-group-group-update"></div>`;

				edit_contact_group += "<form id='select_group' method='POST' action='' style='margin-top: 20px;' data-ajax='false'>";

				var retrievedGroups = localStorage.getItem('groups');
				var groups = JSON.parse(retrievedGroups);

				for (j = 0; j < groups.length; j++) {

					if (groups[j].gid == 193 || groups[j].gid == 202 || groups[j].uid == localStorage.getItem('uid')) {


						edit_contact_group += '<div class="formfield campaigncheck">';
						edit_contact_group += '<label class="campaignlabel contact-group-label-'+groups[j].gid+'" data-role="none"><span class="campname" for="contact-campaign-'+groups[j].gid+'">'+groups[j].name+'</span>';
						edit_contact_group += '<input id="contact-group-'+groups[j].gid+'" type="checkbox" value="[GROUP_SELECTED]-'+groups[j].gid+'" style="float: right;position: unset;" class="selectone contact_group"><span class="checkmarkcampaign"></span></label>';
						edit_contact_group += '</div>';
					}

				}

				edit_contact_group += '<div class="buttonbacksave">';
				edit_contact_group += '<div class="alignleft halfwidth"><a href="#prospect" data-mini="true" data-container="edit_contact_camp_group_page" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/> Back</a></div>';
				edit_contact_group += '<div class="alignleft halfwidth savebtneditcontact" style="padding: 10px;width: 155px;"><input id="select-contact-group-btn" type="button" data-mini="true" class="" name="" value="Save"></div>';
				edit_contact_group += '</div>';

				edit_contact_group += "</form>";
				edit_contact_group += '</div>';

				$("#edit_contact_camp_group_page #edit_camp_group_page div").html(edit_contact_group);
				$("#edit_contact_camp_group_page").animate({
					marginLeft: '-=100%'
				}, slideSpeed);

				$('.contact_group').on('change', function() {
				    $('.contact_group').not(this).prop('checked', false);
				});


	            $("#select-contact-group-btn").on('tap', function(e){

	            	e.stopImmediatePropagation();
	            	e.preventDefault();

	            	//console.log($("#select_group").serialize());

	            	var chkArray = [];

					/* look for all checkboes that have a class 'chk' attached to it and check if it was checked */
					$(".contact_group:checked").each(function() {
						chkArray.push($(this).val());
					});

					/* we join the array separated by the comma */
					var selected;
					selected = chkArray.join(',') ;

					$("#send-email-form #email_to").val(selected);

	            	$("#edit_contact_camp_group_page").animate({
						marginLeft: '+=100%'
					}, slideSpeed);

	            });

		},

		addContactCampaign: function() {


				var add_contact_campaign = "";

				add_contact_campaign += `<div class="headercampaign">
												<div id="topheaderform" >
													<ul style="padding-top:0;text-align:center;">
														<li style="width:100%;">
															Campaign
														</li>
													</ul>
												</div>
												<div class="result-group-camp-update"></div>`;

				add_contact_campaign += "<form id='add_campaign' method='POST' action='' style='margin-top: 20px;' data-ajax='false'>";

				var retrievedCampaigns = localStorage.getItem('campaigns');
				var campaigns = JSON.parse(retrievedCampaigns);

				for (j = 0; j < campaigns.length; j++) {

					campaign_cpgid = campaigns[j].cp_gid;

					add_contact_campaign += '<div class="formfield campaigncheck">';
					add_contact_campaign += '<label class="campaignlabel" data-role="none"><span class="campname" for="contact-campaign-'+campaigns[j].cp_gid+'">'+campaigns[j].name+'</span>';
					add_contact_campaign += '<input id="contact-campaign-'+campaigns[j].cp_gid+'" type="checkbox" name="edit-cp_gid" value="'+campaigns[j].cp_gid+'" style="float: right;position: unset;" class="selectone contact_campaign"><span class="checkmarkcampaign"></span></label>';
					add_contact_campaign += '</div>';

				}

				add_contact_campaign += '<div class="buttonbacksave">';
				add_contact_campaign += '<div class="alignleft halfwidth"><a href="#add_contact" data-mini="true" data-container="edit_contact_camp_group_page" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/> Back</a></div>';
				add_contact_campaign += '<div class="alignleft halfwidth savebtneditcontact" style="padding: 10px;width: 155px;"><input id="add-contact-campaign-btn" type="button" data-mini="true" class="" name="" value="Save"></div>';
				add_contact_campaign += '</div>';


				add_contact_campaign += "</form>";
				add_contact_campaign += '</div>';

				$("#edit_contact_camp_group_page #edit_camp_group_page div").html(add_contact_campaign);
				$("#edit_contact_camp_group_page").animate({
					marginLeft: '-=100%'
				}, slideSpeed);

				$('.contact_campaign').each(function() {
					selected_cpgid = $(this).val();

				    //console.log(selected_cpgid+" : "+$("#contact-campaign-hdn-selected-"+selected_cpgid).val());

				    if ($("#contact-campaign-hdn-selected-"+selected_cpgid).length > 0) {
				    	$(this).prop("checked", true);
				    }
				});

				$('.contact_campaign').on('change', function() {
				    $('.contact_campaign').not(this).prop('checked', false);
				});

	            /*$.mobile.changePage("#dynamic_page", {
							            transition: 'none',
							            changeHash: true,
							            role: 'page'
							        });*/


	            $(document).on('click', '#add-contact-campaign-btn', function(e){

	            	e.stopImmediatePropagation();
	            	e.preventDefault();

	            	var chkArray = [];

	            	campaignName = $(".selectone.contact_campaign:checked").parent().find(".campname").html();
					$(".add_contact_campaign span").html(campaignName);

	            	$(".contact_campaign:checked").each(function() {
						chkArray.push($(this).val());
					});

	            	$("#add-contact-form #add_contact_cp_gid").val(chkArray);

	            	$("#edit_contact_camp_group_page").animate({
						marginLeft: '+=100%'
					}, slideSpeed);
	            });


		},

		addContactGroups: function() {


				var edit_contact_group = "";

				edit_contact_group += `<div class="headercampaign addcontactgroupheader">
												<div id="topheaderform" style="height:15px;">
													<ul style="padding-top:0;text-align:center;padding-bottom:10px;">
														<li style="width:100%;">
															Group
														</li>
													</ul>
												</div>
												<div class="result-group-group-update"></div>`;

				edit_contact_group += "<form id='add_group' method='POST' action='' style='margin-top: 20px;' data-ajax='false'>";

				var retrievedGroups = localStorage.getItem('groups');
				var groups = JSON.parse(retrievedGroups);

				for (j = 0; j < groups.length; j++) {

					if (groups[j].gid == 193 || groups[j].gid == 202 || groups[j].uid == localStorage.getItem('uid')) {


						edit_contact_group += '<div class="formfield campaigncheck">';
						edit_contact_group += '<label class="campaignlabel contact-group-label-'+groups[j].gid+'" data-role="none"><span class="campname" for="contact-campaign-'+groups[j].gid+'">'+groups[j].name+'</span>';
						edit_contact_group += '<input id="contact-group-'+groups[j].gid+'" type="checkbox" value="'+groups[j].gid+'" style="float: right;position: unset;" class="selectone contact_group"><span class="checkmarkcampaign"></span></label>';
						edit_contact_group += '</div>';
					}

				}

				edit_contact_group += '<div class="buttonbacksave">';
				edit_contact_group += '<div class="alignleft halfwidth"><a href="#add_contact" data-mini="true" data-container="edit_contact_camp_group_page" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/> Back</a></div>';
				edit_contact_group += '<div class="alignleft halfwidth savebtneditcontact" style="padding: 10px;width: 155px;"><input id="add-contact-group-btn" type="button" data-mini="true" class="" name="" value="Save"></div>';
				edit_contact_group += '</div>';

				edit_contact_group += "</form>";
				edit_contact_group += '</div>';

				$("#edit_contact_camp_group_page #edit_camp_group_page div").html(edit_contact_group);
				$("#edit_contact_camp_group_page").animate({
					marginLeft: '-=100%'
				}, slideSpeed);

				// $('.contact_group').on('change', function() {
				//     $('.contact_group').not(this).prop('checked', false);
				// });

	            $(document).on('click', '#add-contact-group-btn', function(e){

	            	e.stopImmediatePropagation();
	            	e.preventDefault();

	            	//groupName = $(".selectone.contact_group:checked").parent().find(".campname").html();
					//$(".add_contact_group span").html(groupName);

					var chkArray = [];
					var hdn_group_inputs = "";
					var group_names = "";

					$(".contact_group:checked").each(function() {

						chkArray.push($(this).parent().find(".campname").html());
						group_names += '<span class="group_names">'+$(this).parent().find(".campname").html()+'</span><br/>';
						hdn_group_inputs += '<input type="hidden" id="" name="gid[]" value="'+$(this).val()+'">';

					});

					console.log(chkArray);

					$("#add-contact-form .group_name_wrapper").html(group_names);
					$("#add-contact-form .hdn_group_wrapper").html(hdn_group_inputs);

	            	$("#edit_contact_camp_group_page").animate({
						marginLeft: '+=100%'
					}, slideSpeed);

	            });


		},

		editContactTask: function(did) {

			$.ajax({
	            type: "POST",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=task_details&uid="+localStorage.getItem('uid')+"&did="+did,
	            data: $("#change_campaign").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	console.log(response);

	            	//var timestampInMilliSeconds = response.date*1000;
					var date = new Date(response.date);

					var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
					var month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
					var year = date.getFullYear();

					var time = (date.getHours() < 10 ? '0'+date.getHours() : ''+date.getHours()) + ":" + (date.getMinutes() < 10 ? '0'+date.getMinutes() : ''+date.getMinutes());

					var formattedDate = year + '-' + month + '-' + day;

					console.log(time);

	            	$("#edit-contact-task-form #edit_task_did").val(did);
	            	$("#edit-contact-task-form #edit_task_uid").val(localStorage.getItem('uid'));

	            	$("#edit-contact-task-form #edit_task_title").val(response.title);
	            	$("#edit-contact-task-form #edit_task_date").val(formattedDate);
	            	$("#edit-contact-task-form #edit_task_time").val(time);
	            	$("#edit-contact-task-form #edit_task_comment").val(response.comment);
	            	$("#edit-contact-task-form #edit_task_type").val(response.type);
	            	$("#edit-contact-task-form .delete_contact_task").attr("data-did",did);
	          //   	$.mobile.changePage("#edit_contact_task", {
			        //     transition: 'none',
			        //     changeHash: true,
			        //     role: 'page'
			        // });

			        $("#edit_contact_task").animate({
						marginLeft: '-=100%'
					}, slideSpeed);

	            }
	        });

		},

		editContactNote: function(nid) {

			$.ajax({
	            type: "POST",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=get_notes&uid="+localStorage.getItem('uid')+"&nid="+nid,
	            //data: $("#change_campaign").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	console.log(response.notes.content);

	            	$("#edit-contact-note-form #note_uid").val(localStorage.getItem('uid'));
	            	$("#edit-contact-note-form #note_nid").val(nid);
	            	$("#edit-contact-note-form #note_content").val(response.notes.content);
	            	$("#edit-contact-note-form .delete_contact_note").attr("data-nid", nid);

			        $("#edit_contact_note").animate({
						marginLeft: '-=100%'
					}, slideSpeed);

	            }
	        });

		},

		addButtonFunctions: function() {
			$('#logout').on('tap', function(e){
				FUNC.user.logoutUser();
				//e.preventDefault();
			});
		},

		getUserInfo: function(uid) {

			$.ajax({
	            type: "GET",
	            url: "http://webserv.yooblycrm.com/?cmd=user_info&uid="+uid,
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            async: false,
	            beforeSend: function() {
	            },
	            success: function(response) {

	                localStorage.setItem('uid', response.uid);
                    localStorage.setItem('email', response.email);
                    localStorage.setItem('first_name', response.first_name);
                    localStorage.setItem('last_name', response.last_name);

                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

	            }
	        });

		},

		getCampaigns: function() {

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=campaigns_get&uid="+localStorage.getItem('uid'),
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            async: false,
	            beforeSend: function() {
	            },
	            success: function(response) {

	                localStorage.setItem('campaigns', JSON.stringify(response));

                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

	            }
	        });

		},

		getGroups: function() {

	        $.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=groups_get&uid="+localStorage.getItem('uid'),
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            async: false,
	            beforeSend: function() {
	            },
	            success: function(response) {
	            	//console.log(response);
	                localStorage.setItem('groups', JSON.stringify(response));

                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

	            }
	        });

		},

		checkUser: function() {
			//if user has logged in once, redirect to main page. no need to relogin again
			var hash = location.hash.substr(1);
			console.log("hash: "+hash);
			if (hash == "" || hash == "login") {
				if (localStorage.getItem('uid') != null) {

					setTimeout(function(){
		                window.location.hash='#today';
		            },500);
					//$(".page-today").show();

				}else{
					$("#settings_page_slide").animate({
						marginLeft: '+=100%'
					}, slideSpeed);
					$(".page-login").show();
				}
				$(".main-content-wrapper").show();
			}

		},

		logoutUser: function() {
			$('#page_logout').on('tap', function(e){
				//alert("hey");
				if (localStorage.length > 0 ) {
				    localStorage.clear();
				    localStorage.clear('contacts');
				    localStorage.clear('todays_task');
				}

				setTimeout(function(){
					$("div[data-role=footer]").hide();
	                window.location.href='index.html';
	            },500);
			});
		}

	},
	email: {
		init: function() {
			FUNC.email.emailComposer();
		},

		emailComposer:function() {


				$("#email-composer-btn").on('tap', function(e){
					e.stopImmediatePropagation();

					if (connectionStatus == "online") {

						$("#from").val(localStorage.getItem('email'));

						$("#email_to").val("");

						/* $.mobile.changePage("#email_dialog", {
				            transition: 'none',
				            changeHash: true,
				            role: 'dialog'
						}); */
						$("#email_dialog").animate({
							marginLeft: '-=100%'
						}, slideSpeed);

			        } else {

						alert("You must have an active internet connection to use email fu");

					}

				});





			//$("#select_email_template");
			setTimeout( () => {
				$.ajax({
					//url: "http://webserv.yooblycrm.com/?cmd=contact_add&uid="+localStorage.getItem('uid'),
					url: "http://webserv.yooblycrm.com/?cmd=email_templates_get&uid="+localStorage.getItem('uid'),
					dataType: "JSON",
					beforeSend: function() {
						//$("#login_btn").val("Please wait...");
						//$("#login_btn").attr("disabled","disabled");
					},
					success: function(response) {
						emailTemplates = "<option value='0'>Select Template</option>";
						hiddenEmailTemplates = "";
						Object.keys(response).map( (x) => {
							emailTemplates += `
								<option value="${response[x].tid}">
									${response[x].subject}
								</option>
							`;
							hiddenEmailTemplates += `<input type="hidden" id="hdn-email-tpl-subject-${response[x].tid}" value="${response[x].subject}"/><textarea id="hdn-email-tpl-${response[x].tid}">${response[x].body}</textarea>`;
						});
						$(".select_email_template").html(emailTemplates);
						$(".hidden-email-templates").html(hiddenEmailTemplates);
					}
				});
			}, 200);

		},

		sendEmail: function(form_id) {

		}
	},

	contact: {
		init: function() {

			FUNC.contact.getContacts();
			FUNC.contact.getContactsFollowUps();
			FUNC.contact.getContactsNewMember();
			FUNC.contact.getContactsTeam();

		},

		getHistory : function(cid, target){
			$.ajax({
	            type: "GET",
	            url: webApi+"cmd=contact_info&uid="+localStorage.getItem('uid')+"&cid="+cid,
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {
	            	localStorage.setItem('contacts_history_'+cid, JSON.stringify(response));
				},
				complete : function(){
					contactHistory = $.parseJSON( localStorage.getItem('contacts_history_'+cid) );
					console.log(typeof contactHistory);
					divHistory = "";

					if( typeof contactHistory.history  == "object"){

						divHistory += `<ul class="list-group history-list-group">`;
						Object.keys(contactHistory.history).map( (x)=>{

							if(x=="emails"){

								//console.log(contactHistory.history[x]);
								contactHistory.history[x].map( ( em ) => {
 									var d = new Date(em.date * 1000);
									dString = "";
									if(em.sent==1){
										dstring = "Sent - "+d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
									}else{
										dstring = "Receive - "+d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
									}
									divHistory += `
										<li class="list-item list-item-email" style="text-align:left; line-height:30px; font-size:12px; height:auto">
											<i class="fa fa-envelope"></i> <span>${em.subject}  </span>
											<small style="margin-left:20px; float:none; display:block; margin-top:-10px;">${dstring}</small>
										</li>
									`;
								} );
							}
						})
						divHistory += `</ul>`;
					}

					$(target).html(divHistory);
				}
	        });
		},

		updateContacts: function() {

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_list&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	//console.log(response);
	            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
	            	localStorage.setItem('contacts', JSON.stringify(response));

	            }
	        });

		},

		updateSingleContact : function(){
			$.ajax({
	            type: "GET",
	            url: "http://webserv.yooblycrm.com/?cmd=contact_info&uid="+localStorage.getItem('uid')+"&cid="+cid,
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

					contacts = localStorage.getItem('contacts');
					console.log(contacts);
	            	console.log(response);
	            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
	            	//localStorage.setItem('contacts', JSON.stringify(response));

	            }
	        });
		},

		updateContactsTodaysCall: function() {

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=followups&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	//console.log(response);
	            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
	            	localStorage.setItem('contacts_followups', JSON.stringify(response));

	            }
	        });

		},

		updateContactsNewMembers: function() {

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=new_leads&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	//console.log(response);
	            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
	            	localStorage.setItem('contacts_new_leads', JSON.stringify(response));

	            }
	        });

		},

		updateContactsTeam: function() {

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_teams&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	//console.log(response);
	            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
	            	localStorage.setItem('contacts_contact_teams', JSON.stringify(response));

	            }
	        });

		},

		getContacts: function() {

			$(".contacts_table").hide();
			//console.log("getContacts : "+localStorage.getItem('contacts'));
			if (localStorage.getItem('contacts') === null) {
				$.ajax({
		            type: "GET",
		            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_list&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
		            //data: $("#login-form").serialize(),
		            dataType: "JSON",
		            beforeSend: function() {
		            },
		            success: function(response) {

		            	//console.log(response);
		            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
		            	localStorage.setItem('contacts', JSON.stringify(response));

		            }
		        });
			}

			setTimeout(function(){
				// start show all contacts

				table_content_all_contacts = "";
				table_content_all_contacts += "<form id='form_contact' method='POST' action='' >";

				//show offline added contacts
				//console.log(localStorage.getItem('offline_contacts'));

				if (localStorage.getItem('offline_contacts') !== null) {

					var offlineContacts = localStorage.getItem('offline_contacts');
					var parsedContacts = JSON.parse(offlineContacts);

					for(var i = 0; i < parsedContacts.length; i++) {
						//console.log(parsedContacts[i].fullname);

			    		name = "";
						if(parsedContacts[i].first_name.length > 0 ) name += parsedContacts[i].first_name+ " ";
						if(parsedContacts[i].last_name.length > 0 ) name += parsedContacts[i].last_name+ " ";


						table_content_all_contacts += `

							<ul id="div-${parsedContacts[i].cid}" class="contact-list-${parsedContacts[i].cid} listcontactwrapper">
								<li class="" style="text-align:left">
									<div class="contactcheck align-left" style="float:left;">
										<button style="border:none; background:none" class="contactcheckwrap contact-ck" type="button">
											<label class=''>
												<input type='checkbox' value="${parsedContacts[i].cid}" id="" name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span>
											</label>
										</button>
									</div>
									<button style="display:block; background:none;border:none; text-align:left; padding:0px; width:80%; float:left;    margin: 10px 0; "
											type='button' class='contact_details_prospect'
											data-cid="${parsedContacts[i].cid}">
										<div class='align-left contact_info'>
											<h1>${name}</h1>
										</div>
										<div>
											<div>
												<a href='#' class='contact_details_prospect' data-cid="${parsedContacts[i].cid}" style='font-size:20px;'><img src='images/rightarrow.png' width='10'/></a>
											</div>
										</div>
									</button>
								</li>
							</ul>
							<div class="clearfix"> </div>

						`;
					}

				}

				if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

					// READ STRING FROM LOCAL STORAGE
					var retrievedObject = localStorage.getItem('contacts');

					// CONVERT STRING TO REGULAR JS OBJECT
					var parsedObject = JSON.parse(retrievedObject);
					//console.log(parsedObject[0].fullname);


					searchKey = $(".prospects-search-contacts").val();


					for(var i = 0; i < parsedObject.length; i++) {
						show = true;
						if(searchKey.length > 0 ){
							str = parsedObject[i].first_name + parsedObject[i].last_name + parsedObject[i].email;
							var n = str.toLowerCase().indexOf(searchKey.toLowerCase());

							if(n < 0){
								show = false;
							}

						}



						if(show){
							name = "";
							if(parsedObject[i].first_name.length > 0 ) name += parsedObject[i].first_name+ " ";
							if(parsedObject[i].last_name.length > 0 ) name += parsedObject[i].last_name+ " ";


							table_content_all_contacts += `

								<ul id="div-${parsedObject[i].cid}" class="contact-list-${parsedObject[i].cid} listcontactwrapper">
									<li class="" style="text-align:left">
										<div class="contactcheck align-left" style="float:left;">
											<button style="border:none; background:none" class="contactcheckwrap contact-ck" type="button">
												<label class=''>
													<input type='checkbox' value="${parsedObject[i].cid}" id="" name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span>
												</label>
											</button>
										</div>
										<button style="display:block; background:none;border:none; text-align:left; padding:0px; width:80%; float:left;    margin: 10px 0; "
												type='button' class='contact_details_prospect'
												data-cid="${parsedObject[i].cid}">
											<div class='align-left contact_info'>
												<h1>${name}</h1>
											</div>
											<div>
												<div>
													<a href='#' class='contact_details_prospect' data-cid="${parsedObject[i].cid}" style='font-size:20px;'><img src='images/rightarrow.png' width='10'/></a>
												</div>
											</div>
										</button>
									</li>
								</ul>
								<div class="clearfix"> </div>

							`;
						}


					}
				}

		        table_content_all_contacts += "</form>";
				$(".contacts_table").html(table_content_all_contacts);
				//alert(table_content_all_contacts);
				$(".test123").html("111222333");
				setTimeout(function(){
					$(".contacts_table").show();
				}, 200);


			},700);

		},

		getContactsFollowUps: function() { //Todays Call

			//console.log("getContacts : "+localStorage.getItem('contacts'));
			if (localStorage.getItem('contacts_followups') === null) {
				$.ajax({
		            type: "GET",
		            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=followups&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
		            //data: $("#login-form").serialize(),
		            dataType: "JSON",
		            beforeSend: function() {
		            },
		            success: function(response) {

		            	//console.log(response);
		            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
		            	localStorage.setItem('contacts_followups', JSON.stringify(response));

		            }
		        });
			}

			setTimeout(function(){

				// start show todays call contacts

				table_content_todayscall = "";
				table_content_todayscall += "<form id='form_contact' method='POST' action=''>";

				//show offline added contacts
				//console.log(localStorage.getItem('offline_contacts'));

				if (typeof localStorage.getItem('contacts_followups') !== 'undefined' && localStorage.getItem('contacts_followups') !== null) {

					// READ STRING FROM LOCAL STORAGE
					var retrievedObject = localStorage.getItem('contacts_followups');

					// CONVERT STRING TO REGULAR JS OBJECT
					var parsedObject = JSON.parse(retrievedObject);
					//console.log(parsedObject[0].fullname);

					searchKey = $(".prospects-search-contacts").val();

					for(var i = 0; i < parsedObject.length; i++) {
						show = true;
						if(searchKey.length > 0 ){
							str = parsedObject[i].first_name + parsedObject[i].last_name + parsedObject[i].email;
							var n = str.toLowerCase().indexOf(searchKey.toLowerCase());

							if(n < 0){
								show = false;
							}

						}

						if(show){
							table_content_todayscall += `
								<ul id="div-${parsedObject[i].cid}" class="contact-list-${parsedObject[i].cid}  listcontactwrapper" >
									<li class="" style="text-align:left">
										<div class="contactcheck align-left" style="float:left;">
										<button style="border:none; background:none" class="contactcheckwrap contact-ck" type="button">
											<label class=''>
												<input type='checkbox' value="${parsedObject[i].cid}" id="" name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span>
											</label>
											</button>
										</div>

										<button style="display:block; background:none;border:none; text-align:left; padding:0px; width:80%; float:left;
										margin: 10px 0; " type="button"
										class="contact_details_prospect" data-cid="${parsedObject[i].cid}">

											<div class='align-left contact_info'>
												<h1>${parsedObject[i].first_name} ${parsedObject[i].last_name}</h1>
											</div>
											<div>
												<div>
													<a href='#' class='' data-cid="${parsedObject[i].cid}" style='font-size:20px;'><img src='images/rightarrow.png' width='10'/></a>
												</div>
											</div>
										</button>
									</li>
								</ul>
							`;
						}


					}
				}

		        table_content_todayscall += "</form>";

				$("#todayscall #todayscall_contact").html(table_content_todayscall);
				setTimeout(function(){
					$("#todayscall #todayscall_contact").show();
				}, 200);

		        /*$('.contact_details_prospect').on('tap', function(e) {
		        	e.preventDefault();
		        	e.stopImmediatePropagation();
					//console.log(e);

					//var contact_cid = e.currentTarget.attributes[2].nodeValue;
					var contact_cid = $(e.currentTarget).attr("data-cid");
					//console.log(contact_cid);
					FUNC.user.showContactDetails(contact_cid);

				});*/

			},700);

		},

		getContactsNewMember: function() { //Last 7 Days

			//console.log("getContacts : "+localStorage.getItem('contacts'));
			if (localStorage.getItem('contacts_new_leads') === null) {
				$.ajax({
		            type: "GET",
		            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=new_leads&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
		            //data: $("#login-form").serialize(),
		            dataType: "JSON",
		            beforeSend: function() {
		            },
		            success: function(response) {

		            	//console.log(response);
		            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
		            	localStorage.setItem('contacts_new_leads', JSON.stringify(response));

		            }
		        });
			}

			//console.log("new_leads : "+localStorage.getItem('contacts_new_leads'));

			setTimeout(function(){

				// start show new leads contacts

				table_content_lastdays = "";
				table_content_lastdays += "<form id='form_contact' method='POST' action=''>";

				//show offline added contacts
				//console.log(localStorage.getItem('offline_contacts'));

				if (typeof localStorage.getItem('contacts_new_leads') !== 'undefined' && localStorage.getItem('contacts_new_leads') !== null) {

					// READ STRING FROM LOCAL STORAGE
					var retrievedObject = localStorage.getItem('contacts_new_leads');

					// CONVERT STRING TO REGULAR JS OBJECT
					var parsedObject = JSON.parse(retrievedObject);
					//console.log(parsedObject[0].fullname);

					searchKey = $(".prospects-search-contacts").val();

					for(var i = 0; i < parsedObject.length; i++) {
						show = true;
						if(searchKey.length > 0 ){
							str = parsedObject[i].first_name + parsedObject[i].last_name + parsedObject[i].email;
							var n = str.toLowerCase().indexOf(searchKey.toLowerCase());

							if(n < 0){
								show = false;
							}

						}

						if(show){
							table_content_lastdays += `
								<ul id="div-${parsedObject[i].cid}" class="contact-list-${parsedObject[i].cid}  listcontactwrapper" >
									<li class="" style="text-align:left">
										<div class="contactcheck align-left" style="float:left;">
										<button style="border:none; background:none" class="contactcheckwrap contact-ck" type="button">
											<label class=''>
												<input type='checkbox' value="${parsedObject[i].cid}" id="" name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span>
											</label>
											</button>
										</div>
										<button style="display:block; background:none;border:none; text-align:left; padding:0px; width:80%; float:left;    margin: 10px 0; "
												type='button' class='contact_details_prospect' data-cid="${parsedObject[i].cid}">
											<div class='align-left contact_info'>
												<h1>${parsedObject[i].first_name} ${parsedObject[i].last_name}</h1>
											</div>
											<div>
												<div>
													<a href='#' class='contact_details_prospect' data-cid="${parsedObject[i].cid}" style='font-size:20px;'><img src='images/rightarrow.png' width='10'/></a>
												</div>
											</div>
										</button>
									</li>
								</ul>
							`;
						}


					}
				}

		        table_content_lastdays += "</form>";

				$("#lastdays #lastdaysdata").html(table_content_lastdays);
				setTimeout(function(){
					$("#lastdays #lastdaysdata").show();
				}, 200);

		        /*$('.contact_details_prospect').on('tap', function(e) {
		        	e.preventDefault();
		        	e.stopImmediatePropagation();
					//console.log(e);

					//var contact_cid = e.currentTarget.attributes[2].nodeValue;
					var contact_cid = $(e.currentTarget).attr("data-cid");
					//console.log(contact_cid);
					FUNC.user.showContactDetails(contact_cid);

				});*/

			},700);

		},

		getContactsTeam: function() {

			//console.log("getContacts : "+localStorage.getItem('contacts'));
			if (localStorage.getItem('contacts_contact_teams') === null) {
				$.ajax({
		            type: "GET",
		            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_teams&uid="+localStorage.getItem('uid')+"&start=0&length=20&search_key=",
		            //data: $("#login-form").serialize(),
		            dataType: "JSON",
		            beforeSend: function() {
		            },
		            success: function(response) {

		            	//console.log(response);
		            	//var string = '{"items":[{"Desc":"Item1"},{"Desc":"Item2"}]}';
		            	localStorage.setItem('contacts_contact_teams', JSON.stringify(response));

		            }
		        });
			}

			setTimeout(function(){

				// start show team contacts

				table_content_team = "";
				table_content_team += "<form id='form_contact' method='POST' action=''>";

				if (typeof localStorage.getItem('contacts_contact_teams') !== 'undefined' && localStorage.getItem('contacts_contact_teams') !== null) {

					// READ STRING FROM LOCAL STORAGE
					var retrievedObject = localStorage.getItem('contacts_contact_teams');

					// CONVERT STRING TO REGULAR JS OBJECT
					var parsedObject = JSON.parse(retrievedObject);
					//console.log(parsedObject[0].fullname);

					searchKey = $(".prospects-search-contacts").val();

					for(var i = 0; i < parsedObject.length; i++) {
						show = true;
						if(searchKey.length > 0 ){
							str = parsedObject[i].first_name + parsedObject[i].last_name + parsedObject[i].email;
							var n = str.toLowerCase().indexOf(searchKey.toLowerCase());

							if(n < 0){
								show = false;
							}

						}

						if(show){
							table_content_team += `
								<ul id="div-${parsedObject[i].cid}" class="contact-list-${parsedObject[i].cid}  listcontactwrapper" >
									<li class="" style="text-align:left">
										<div class="contactcheck align-left" style="float:left;">
										<button style="border:none; background:none" class="contactcheckwrap contact-ck" type="button">
											<label class=''>
												<input type='checkbox' value="${parsedObject[i].cid}" id="" name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span>
											</label>
											</button>
										</div>
										<button style="display:block; background:none;border:none; text-align:left; padding:0px; width:80%; float:left;    margin: 10px 0; "
												type='button' class='contact_details_prospect'>
											<div class='align-left contact_info'>
												<h1>${parsedObject[i].first_name} ${parsedObject[i].last_name}</h1>
											</div>
											<div>
												<div>
													<a href='#' class='contact_details_prospect' data-cid="${parsedObject[i].cid}" style='font-size:20px;'><img src='images/rightarrow.png' width='10'/></a>
												</div>
											</div>
										</button>
									</li>
								</ul>
							`;
						}


					}
				}

		        table_content_team += "</form>";

				$("#teamcontacts #teamdata").html(table_content_team);
				setTimeout(function(){
					$("#teamcontacts #teamdata").show();
				}, 200);

		        /*$('.contact_details_prospect').on('tap', function(e) {
		        	e.preventDefault();
		        	e.stopImmediatePropagation();
					//console.log(e);

					//var contact_cid = e.currentTarget.attributes[2].nodeValue;
					var contact_cid = $(e.currentTarget).attr("data-cid");
					//console.log(contact_cid);
					FUNC.user.showContactDetails(contact_cid);

				});*/

			},700);
		},

		contactDetails: function(cid) {
			//console.log("http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_info&uid="+localStorage.getItem('uid')+"&cid="+cid);

			var contact_task_content = "";
			var contact_note_content = "";

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_info_v2&uid="+localStorage.getItem('uid')+"&cid="+cid,
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	console.log(response);

					var parsedContactDetails = JSON.stringify(response);
					var contact_details = JSON.parse(parsedContactDetails);

					var dt = new Date();

					var day = (dt.getDate() < 10 ? '0' : '') + dt.getDate();
					var month = (dt.getMonth() < 9 ? '0' : '') + (dt.getMonth() + 1);
					var year = dt.getFullYear();

					var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
					var formattedDateTime = year + '-' + month + '-' + day + ' '+ time;
					// document.write(time);

					if (typeof contact_details.tasks !== 'undefined' && contact_details.tasks !== null) {

						for (i = 0; i < contact_details.tasks.length; i++) {
							if (contact_details.tasks[i].status != 0) {
								checkbox_style = "display:none;";
								text_style = "text-decoration:line-through;padding-left:15px;";
								//edit_style = "display:none;";
							} else {
								checkbox_style = "";
								text_style = "";
								//edit_style = "display:block;";
							}
							contact_task_content += `
									<div class="taskinfo contact_task_details-${contact_details.tasks[i].did}" style="clear: both;">
										<div class="contactcheck align-left">
											<form id="update-task-form-${contact_details.tasks[i].did}" method="POST" action="">
												<input type="hidden" name="uid" value="${localStorage.getItem('uid')}">
												<input type="hidden" name="task_did" value="${contact_details.tasks[i].did}">
												<input type="hidden" name="task_title" value="${contact_details.tasks[i].title}">
												<input type="hidden" name="task_comment" value="${contact_details.tasks[i].comment}">
												<input type="hidden" name="task_date" placeholder="Set a date" value="${formattedDateTime}">
												<input type="hidden" name="status" value="1">
											</form>
											<button style="border:none; background:none; ${checkbox_style}" class="contactcheckwrap contact_task_checkbox" type="button">
												<label class=''>
													<input type='checkbox' value="${contact_details.tasks[i].did}" id="" name='contact_task_did' class='contact-checkbox' /><span class='checkmark'></span>
												</label>
											</button>
										</div>
										<div class='align-left contact_info edit-task-btn' style='width: 50%;float:left;' data-did='${contact_details.tasks[i].did}' >
											<h1 style="${text_style}">${contact_details.tasks[i].title}</h1>
										</div>
										<div class='align-left contact_info edittaskbtn' style='width: 20%;float:right;'>
											<button data-did='${contact_details.tasks[i].did}'
											type="button"  class="custom_btn edit-task-btn"
											style='float: right;text-align:right;box-shadow: none;'>Edit</button>
										</div>
									</div>`;
							//contact_task_content += "<span>"+contact_details.tasks[i].title+"</span>";

						}

						$("#contact_tasks #contact_tasks_content").html(contact_task_content);

					}

					//console.log("notes : "+contact_details.notes);

					if (typeof contact_details.notes !== 'undefined' && contact_details.notes !== null) {

						for (i = 0; i < contact_details.notes.length; i++) {
							contact_note_content += `
									<div class="notelist contact_note_details-${contact_details.notes[i].nid}" style="clear: both;height: 30px;">
										<div class='align-left contact_info' style='width: 50%;float:left;margin:0;'>
											<h1>${contact_details.notes[i].content}</h1>
										</div>
										<div class='align-left contact_info editnotebtn' style='width: 20%;float:right;margin:0;'>
											<button id=\"edit-note-btn\" data-nid='${contact_details.notes[i].nid}' type=\"button\" data-mini=\"true\" class=\"custom_btn\" style='float: right;text-align:right;box-shadow: none;'> Edit </button>
										</div>
									</div>`;
							//contact_task_content += "<span>"+contact_details.tasks[i].title+"</span>";

						}

						$("#contact_notes #contact_notes_content").html(contact_note_content);

					}

	            }
	        });


		},
		removeContact: function() {

			$(document).on('click', '#delete-contact-btn', function(e){

				e.preventDefault();
				e.stopImmediatePropagation();

				if (connectionStatus == 'online') {
					var cid = "";
					$('.contact-checkbox:checked').each(function(){
					  cid += $(this).val()+",";
					});
					cid = cid.substring(0,cid.length - 1)
					console.log(cid);

					$.ajax({

						type:"POST",
						url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_delete_new&uid="+localStorage.getItem('uid')+"&cid="+cid,
						dataType: "JSON",
						success: function(response) {
							console.log(response);

							// $("#dynamic_dialog .dialog_content div").html(response.success+" contact(s) removed.");
				   //          $.mobile.changePage("#dynamic_dialog", {
							// 			            transition: 'none',
							// 			            changeHash: true,
							// 			            role: 'dialog'
							// 			        });

							//$(".result-sync-contacts").html("Contact removed.");

				            localStorage.removeItem('contacts');
				            FUNC.contact.getContacts();

				            setTimeout(function(){

								FUNC.contact.getContacts();
								$(".result-sync-contacts").html("");

							},700);
						}
					});

				} else { //if contacts are removed in offline

					var deleted_contacts = 0;
					//start to add contact cid to delete queue

					$('.contact-checkbox:checked').each(function(){

						var olddata = JSON.parse(localStorage.getItem('offline_contacts_delete')) || [];

						var data = olddata;

						var obj = {
								cid:$(this).val()
							};

						data.push(obj);

						//update localstorage
						localStorage.setItem('offline_contacts_delete', JSON.stringify(data));

						//start removing contact from json contact list and update
						// READ STRING FROM LOCAL STORAGE
						var retrievedObject = localStorage.getItem('contacts');

						// CONVERT STRING TO REGULAR JS OBJECT
						var parsedObject = JSON.parse(retrievedObject);
						//console.log(parsedObject[0].fullname);

						for (var i = 0; i < parsedObject.length; i++) {
							if (parsedObject[i].cid == $(this).val()) {
								console.log(parsedObject[i]);
								parsedObject.splice(i,1);
								deleted_contacts++;
								//delete parsedObject[i];
							}
						}

						console.log(parsedObject);

						//update localstorage
						localStorage.setItem('contacts', JSON.stringify(parsedObject));

						//$(".result-sync-contacts").html("Contact removed.");

						// $("#dynamic_dialog .dialog_content div").html(deleted_contacts+" contact(s) removed.");
				  //           $.mobile.changePage("#dynamic_dialog", {
						// 				            transition: 'none',
						// 				            changeHash: true,
						// 				            role: 'dialog'
						// 				        });

				        $("#div-"+$(this).val()).remove();
				        setTimeout(function(){

							$(".result-sync-contacts").html("");

						},700);

					});


				}
			});

		},

		addContact: function() {

			//set uid in hidden div
			$("#uid").val(localStorage.getItem('uid'));

		},

		addContactOffline: function() {

			// READ STRING FROM LOCAL STORAGE
			//var retrievedObject = localStorage.getItem('contacts');
			var olddata = JSON.parse(localStorage.getItem('offline_contacts')) || [];

	        var data = olddata;

			var obj = {
						fullname: $("#first_name").val()+" "+$("#last_name").val(),
						cid:"0",
						uid: localStorage.getItem('uid'),
						cp_gid: $("#campaigns").val(),
						campaign_status: "0",
						campaign_start:"2019-07-16 21:52:22",
						first_name: $("#first_name").val(),
						last_name: $("#last_name").val(),
						phone: $("#phone").val(),
						phone_alt:"",
						address:"",
						city:"",
						state:"",
						zip:"",
						email: $("#email").val(),
						website:"",
						date:"",
						form:"0",
						confirmed:"0",
						rating:"0",
						is_new:"1",
						raw_post_data:null,
						raw_server_data:null,
						contact_ip_address:null,
						facebook_url:""
					};

			data.push(obj);

			console.log(data);

			//update localstorage
			localStorage.setItem('offline_contacts', JSON.stringify(data));

			//alert("contact has been added offline");
			//$.mobile.changePage("#sucess_page");
			setTimeout(function(){
                $("#result-add-contact").html("");
                $('#add-contact-form')[0].reset();
                $('#add-contact-form .add_contact_campaign').html("<span class='camp_name'>Campaign Names</span>");
                //$('#add-contact-form .add_contact_group span').remove();
                $('#add-contact-form .hdn_group_wrapper').html("");
                $('#add-contact-form .group_name_wrapper').html("");
                $('#add-contact-form .add_contact_group').html("<span class='default'>Group Names</span>");
                $('#add-contact-form #add_contact_cp_gid').val("");
                //$('#add-contact-form .hdn_groups').remove();

			},700);

			setTimeout(() => {
				//FUNC.contact.updateSingleContact(response.success);
				setTimeout(function(){
					FUNC.contact.updateContacts();

					$.mobile.changePage("#prospect", {
						transition: 'none',
						changeHash: true,
						role: 'page'
					});
				},700);
			}, 300);
		}

	}


}


sendResetPwdLink = function(){
	$.ajax({
		url: "http://ernest.qfautopilot.com/ajax_event_2.php?method=users&task=send_reset_password&request_type=cors",
		type: "post",
		data: $("#forgot_pass").serialize(),
		dataType: "json",
		success: function(d){
					$("#reset_response").text("Reset Successful, Please Check Your Inbox");
			}

	});
}




$(document).on("keyup", ".prospects-search-contacts", function(){
	FUNC.contact.getContacts();
});

//StatusBar.overlaysWebView(false);
//StatusBar.hide();
//StatusBar.styleDefault();



window.addEventListener('keyboardDidShow', (event) => {
	$('html, body').scrollTop(0);
	$(".add-contact-bottom-bar").addClass("float-add-contact-actions");
	$("body").addClass("keyboard-open");

	listenerLoop = 0;
	htmlBodyScroll = setInterval(()=>{
		if( $("#add_contact").css("display") =="block"){
			$('html, body').scrollTop(0);
		}

		if(listenerLoop > 100){
			clearInterval(htmlBodyScroll);
		}
		listenerLoop++;
	},0);
	//alert("keyboard is hidden");
});
window.addEventListener('keyboardWillShow', (event) => {
    // Describe your logic which will be run each time when keyboard is about to be shown.
	$("#universal-footer").css({"opacity":"0", "visibility":"hidden"});
	$("body").addClass("keyboard-open");
	$('html, body').scrollTop(0);
	$(".add-contact-bottom-bar").addClass("float-add-contact-actions");
	//alert("keyboard is shown");

	listenerLoop = 0;
	htmlBodyScroll = setInterval(()=>{
		if( $("#add_contact").css("display") =="block"){
			$('html, body').scrollTop(0);
		}

		if(listenerLoop > 100){
			clearInterval(htmlBodyScroll);
		}
		listenerLoop++;
	},0);

});

window.addEventListener('keyboardDidHide', () => {
	// Describe your logic which will be run each time keyboard is closed.
	$("#universal-footer").css({"opacity":"1", "visibility":"visible"});
	$("body").removeClass("keyboard-open");
	$('html, body').scrollTop(0);
	$(".add-contact-bottom-bar").removeClass("float-add-contact-actions");
	//alert("keyboard is shown");
	clearInterval(htmlBodyScroll);
	console.log(htmlBodyScroll);
});


/* move button event listeners */
$(document).on('click', ".contact-email-composer-btn", function(e){
	//console.log(contact_email);

	console.log("test");
	$("#email_dialog").animate({
		marginLeft: '-=100%'
	}, slideSpeed);

	if(typeof $(e).attr("data-email") == "undefined"){
		$("#email_to").val($(e.currentTarget).attr("data-email"));
	}else{
		$("#email_to").val($(e).attr("data-email"));
	}

	$("#from").val(localStorage.getItem('email'));


	$("#universal-footer li a").removeClass("ui-btn-active");
	setTimeout(function(){
		$("#universal-footer li a#page_email").addClass("ui-btn-active");

	}, 100);

});

$(document).on('click', '.edit_contact_btn' , (e) => {

	//console.log(e.currentTarget.nodeValue);
	console.log( $(e.currentTarget).attr("data-cid") );

	FUNC.user.editContact($(e.currentTarget).attr("data-cid"));
	e.stopImmediatePropagation();
});

$(document).on("change", '#contact_campaigns', function (e) {
	e.stopImmediatePropagation();
	e.preventDefault();

	  $.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=campaigns_update&uid="+localStorage.getItem('uid'),
		data: $("#edit-campaign-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success > 0) {
					//$("#result-group-camp-update").html("Campaign saved!");

					//update list
					setTimeout(function(){
						FUNC.contact.updateContacts();
					},700);
				} else {
					//$("#result-group-camp-update").html("Error updating contact campaign.");
				}

				setTimeout(function(){
					$("#result-group-camp-update").html("");
				},1500);

			//$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

		}
	});

});

//allow only one checkbox to be selected at a time
$(document).on("change",'.campaign_contact', function (e) {
	console.log(e);
 	// var group = ":checkbox[name='"+ $(this).attr("name") + "']";
  //  	if($(this).is(':checked')){
  //   	$(group).not($(this)).attr("checked",false);
  //  	}
});

$(document).on("change",'#contact_group', function (e) {
	e.stopImmediatePropagation();
	e.preventDefault();
	console.log(e);
	  $.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=groups_add&uid="+localStorage.getItem('uid'),
		data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success > 0) {
					$("#result-group-camp-update").html("Group saved!");
					$("#groups_content").append("<span>"+$("#contact_group option:selected").text()+"</span><br />");
					//update list
					setTimeout(function(){
						FUNC.contact.updateContacts();
					},1000);
				} else {
					$("#result-group-camp-update").html("Error updating contact group.");
				}

				setTimeout(function(){
					$("#result-group-camp-update").html("");
				},1500);

			//$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

		}
	});

});

$(document).on('click',".add_contact_campaign", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	FUNC.user.addContactCampaign();
});

$(document).on('click',".add_contact_group", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	FUNC.user.addContactGroups();
});

$(document).on('click',".edit_contact_campaign-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	console.log(e);

	//var cp_gid = e.currentTarget.attributes[2].nodeValue;
	//var cid = e.currentTarget.attributes[3].nodeValue;
	var cid = $(e.currentTarget).attr("data-cid");

	FUNC.user.editContactCampaign(cid);
});

$(document).on('click',".edit_contact_group-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	console.log(e);

	//var cp_gid = e.currentTarget.attributes[2].nodeValue;
	var cid = $(e.currentTarget).attr("data-cid");

	FUNC.user.editContactGroups(cid);
});

$(document).on('click',".select_contact_campaign", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	console.log(e);

	//var cp_gid = e.currentTarget.attributes[2].nodeValue;
	//var cid = $(e.currentTarget).attr("data-cid");

	FUNC.user.selectContactCampaign();
});

$(document).on('click',".select_contact_group", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	console.log(e);

	//var cp_gid = e.currentTarget.attributes[2].nodeValue;
	//var cid = $(e.currentTarget).attr("data-cid");

	FUNC.user.selectContactGroups();
});

$(document).on('click',".edit_contact_area_campaign-btn", function(e){

	//e.stopImmediatePropagation();
	//e.preventDefault();

	console.log(e);

	//var cp_gid = e.currentTarget.attributes[2].nodeValue;
	//var cid = e.currentTarget.attributes[4].nodeValue;
	var cid = $(e.currentTarget).attr("data-cid");

	FUNC.user.editContactCampaign(cid);
});

$(document).on('click',".edit_contact_area_group-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	console.log($(e.currentTarget).attr("data-cid"));

	//var cp_gid = e.currentTarget.attributes[2].nodeValue;
	var cid = $(e.currentTarget).attr("data-cid");

	FUNC.user.editContactGroups(cid);
});

$(document).on('click',".add-task-btn", function(e){

	var cid = $(e.currentTarget).attr("data-cid");

	$("#add-contact-task-form #uid").val(localStorage.getItem('uid'));
	$("#add-contact-task-form #cid").val(cid);

	//$("#add-contact-task-form #title").focus();

	$("#add_contact_task").animate({
		marginLeft: '-=100%'
	}, slideSpeed);

});

$(document).on('click',".add-note-btn", function(e){

	var cid = $(e.currentTarget).attr("data-cid");

	$("#add-contact-note-form #note_uid").val(localStorage.getItem('uid'));
	$("#add-contact-note-form #note_cid").val(cid);

	//$("#add-contact-note-form #add-contact-note-content").focus();

	$("#add_contact_note").animate({
		marginLeft: '-=100%'
	}, slideSpeed);

});

$(document).on('click',".edit-task-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	console.log(e);

	//var did = e.currentTarget.attributes[1].nodeValue;
	var did = $(e.currentTarget).attr("data-did");

	FUNC.user.editContactTask(did);
});

$(document).on('click',"#edit-note-btn", function(e){

	//e.stopImmediatePropagation();
	//e.preventDefault();

	console.log(e);

	//var nid = e.currentTarget.attributes[1].nodeValue;
	var nid = $(e.currentTarget).attr("data-nid");

	FUNC.user.editContactNote(nid);
});

$(document).on('click',"#add-contact-task-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	var formattedDateTime = $("#task_date").val()+" "+$("#task_time").val();
	//console.log(formattedDateTime);
	$.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=add_task&"+$("#add-contact-task-form").serialize()+"&date="+formattedDateTime,
		//data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success == true) {
				//$("#result-add-contact-task").html("Task has been added.");

				FUNC.contact.contactDetails($("#cid").val());
				$("#add-contact-task-form")[0].reset();
				$("#add_contact_task").animate({
					marginLeft: '+=100%'
				}, slideSpeed);
				// setTimeout(function(){

				// },1500);
			} else {
				//$("#result-add-contact-task").html("Error adding task.");
			}

			setTimeout(function(){
				$("#result-add-contact-task").html("");
			},1500);

		}
	});

});

$(document).on('click',"#add-contact-note-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	$.ajax({
		type: "POST",
		url: "http://webserv.yooblycrm.com/?cmd=add_note&"+$("#add-contact-note-form").serialize(),
		//data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success > 0) {
				//$("#result-add-contact-note").html("Note has been added.");
				FUNC.contact.contactDetails($("#note_cid").val());
				$("#add-contact-note-form")[0].reset();
				$("#add_contact_note").animate({
					marginLeft: '+=100%'
				}, slideSpeed);
				// setTimeout(function(){

				// },1500);
			} else {
				//$("#result-add-contact-note").html("Error adding note.");
			}

			setTimeout(function(){
				$("#result-add-contact-note").html("");
			},1500);

		}
	});

});

$(document).on('click', "#add-contact-btn", function(e){
	console.log(e);
	e.stopImmediatePropagation();
    e.preventDefault();

	if ($("#first_name").val() == "" && $("#last_name").val() == "" && $("#email").val() == "") {
		$("#result-add-contact").html("First name, Last name and Email should not be empty.");
		//$("#contact_error_btn").click();
		//$.mobile.changePage( "#myDialog", { role: "dialog" } );

		setTimeout(function(){
			$("#result-add-contact").html("");
		},1000);
	} else {

		if (connectionStatus == "online") {

			$.ajax({
                type:"POST",
                //url: "http://webserv.yooblycrm.com/?cmd=contact_add&uid="+localStorage.getItem('uid'),
                url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=contact_add&uid="+localStorage.getItem('uid'),
                data: $("#add-contact-form").serialize(),
                dataType: "JSON",
                beforeSend: function() {
                    //$("#login_btn").val("Please wait...");
                    //$("#login_btn").attr("disabled","disabled");
                },
                success: function(response) {

                    if (response.success != 0) {

                        setTimeout(function(){
                            $("#result-add-contact").html("");
                            $('#add-contact-form')[0].reset();
                            $('#add-contact-form .add_contact_campaign').html("<span class='camp_name'>Campaign Names</span>");
                            //$('#add-contact-form .add_contact_group span').remove();
                            $('#add-contact-form .hdn_group_wrapper').html("");
                            $('#add-contact-form .group_name_wrapper').html("");
                            $('#add-contact-form .add_contact_group').html("<span class='default'>Group Names</span>");
                            $('#add-contact-form #add_contact_cp_gid').val("");
                            //$('#add-contact-form .hdn_groups').remove();

						},700);

						setTimeout(() => {
							//FUNC.contact.updateSingleContact(response.success);
							setTimeout(function(){
								FUNC.contact.updateContacts();

								$.mobile.changePage("#prospect", {
									transition: 'none',
									changeHash: true,
									role: 'page'
								});
							},700);
						}, 300);


                    } else {

                        //$("#result-add-contact").html("Oops. Something went wrong.");

                    }
                }
            });
		} else {

			FUNC.contact.addContactOffline();
		}

	}

});

$(document).on('click',"#edit-contact-task-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	//console.log($("#add-contact-task-form").serialize());

	// var dt = new Date();

	// var day = (dt.getDate() < 10 ? '0' : '') + dt.getDate();
	// var month = (dt.getMonth() < 9 ? '0' : '') + (dt.getMonth() + 1);
	// var year = dt.getFullYear();

	// var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
	var formattedDateTime = $("#edit_task_date").val()+" "+$("#edit_task_time").val();
	//console.log(formattedDateTime);
	$.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=task_update",
		data : $("#edit-contact-task-form").serialize(),
		//data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success > 0) {
				//$("#result-edit-contact-task").html("Task has been updated.");
				

				$("#contact_tasks_content .contact_task_details-"+$("#edit_task_did").val()+" .edit-task-btn h1").html($("#edit_task_title").val());

				setTimeout(function(){

					$("#edit_contact_task").animate({
						marginLeft: '+=100%'
					}, slideSpeed);
				},700);
			} else {
				//$("#result-edit-contact-task").html("Error updating task.");
			}

			setTimeout(function(){
				$("#result-edit-contact-task").html("");
			},1500);

		}
	});

});

$(document).on('click',"#edit-contact-note-btn", function(e){

	e.stopImmediatePropagation();
	e.preventDefault();

	$.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=update_notes&"+$("#edit-contact-note-form").serialize(),
		//data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success > 0) {
				//$("#result-edit-contact-note").html("Note has been updated.");
				$("#contact_notes_content .contact_note_details-"+$("#note_uid").val()+" .contact_info h1").html($("#note_content").val());
				setTimeout(function(){
					$("#edit_contact_note").animate({
						marginLeft: '+=100%'
					}, slideSpeed);
				},700);
			} else {
				//$("#result-edit-contact-note").html("Error updating note.");
			}

			setTimeout(function(){
				$("#result-edit-contact-note").html("");
			},1500);

		}
	});

});

$(document).on('click', '.contact_details_prospect', function(e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	//console.log(e);

	var contact_cid = $(this).attr("data-cid");
	//console.log(contact_cid);
	$(".contact-list-"+contact_cid).addClass("active");

	setTimeout(function(){
		FUNC.user.showContactDetails(contact_cid);
	},70);

	li = this;
	setTimeout(function(){
		$(".contact-list-"+contact_cid).removeClass("active");
	}, 500);

});


$(document).on("click",".contact_task_checkbox",function(e){
	//console.log(e);

	btn = this;
	$(this).find("input").prop("checked", !$(this).find("input").prop("checked"));
	if($(this).find("input").prop("checked")){
		$(this).find(".checkmark:after").hide();
	}else{
		$(this).find(".checkmark:after").false();
	}
	//console.log( $(this).find("input[name=contact_task_did]").val() );

	var task_did = $(this).find("input[name=contact_task_did]").val();
	//console.log($("#update-task-form-"+task_did).serialize());
	$.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=task_update&",
		data : $("#update-task-form-"+task_did).serialize(),
		//data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success > 0) {
				$(".contact_task_details-"+task_did+" .contact_info h1").attr("style", "text-decoration: line-through;");

				FUNC.user.getTodaysTask();
			}



		}
	});
});

$(document).on("click",".delete_contact_task",function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	//console.log($(e.currentTarget).attr("data-did"));

	//console.log( $(this).find("input[name=contact_task_did]").val() );

	$.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=delete_task&uid="+localStorage.getItem('uid')+"&did="+$(e.currentTarget).attr("data-did"),
		//data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success > 0) {
				//$("#result-edit-contact-task").html("Task is now deleted.");

				$("#contact_tasks #contact_tasks_content .contact_task_details-"+$(e.currentTarget).attr("data-did")).remove();

				setTimeout(function(){
					$("#result-edit-contact-task").html("");
					$("#edit_contact_task").animate({
						marginLeft: '+=100%'
					}, slideSpeed);
				},700);
			} else {
				$("#result-edit-contact-task").html("Error deleting task.");
			}

		}
	});

});

/*
$(document).on('click', '.contact_details', function(e) {
	e.stopImmediatePropagation();
	e.preventDefault();
	//console.log(e);
	//alert("touchend");
	var contact_cid = $(e.currentTarget).attr("data-cid");
	//console.log(contact_cid);
	//$("#view_contact_back_btn").attr("href","#today");

	FUNC.user.showContactDetailsTask(contact_cid);

});*/

$(document).on("click",".delete_contact_note",function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	//console.log($(e.currentTarget).attr("data-did"));

	//console.log( $(this).find("input[name=contact_task_did]").val() );

	$.ajax({
		type: "POST",
		url: "http://webserv.yooblycrm.com/?cmd=delete_note&uid="+localStorage.getItem('uid')+"&nid="+$(e.currentTarget).attr("data-nid"),
		//data: $("#edit-group-form-"+contact_cid).serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

			if (response.success == true) {
				//$("#result-edit-contact-note").html("Note is now deleted.");

				$("#contact_notes #contact_notes_content .contact_note_details-"+$(e.currentTarget).attr("data-nid")).remove();

				setTimeout(function(){
					$("#result-edit-contact-note").html("");
					$("#edit_contact_note").animate({
						marginLeft: '+=100%'
					}, slideSpeed);
				},700);
			} else {
				$("#result-edit-contact-note").html("Error deleting note.");
			}

		}
	});

});
$(document).on("click", "#sync-contact-btn", function() {
	if (!connectionStatus) {
		alert("No internet connection.");
	} else {
		//$(".result-sync-contacts").html("Contacts synced.");

		//console.log(localStorage.getItem('contacts'));
		localStorage.removeItem('offline_contacts');
		localStorage.removeItem('offline_contacts_delete');
		FUNC.sync.addOfflineContact();
		FUNC.sync.removeOfflineContact();
		FUNC.contact.updateContacts();
		FUNC.contact.updateContactsTodaysCall();
		FUNC.contact.updateContactsNewMembers();
		FUNC.contact.updateContactsTeam();
		FUNC.contact.getContacts();
		FUNC.user.getCampaigns();
		FUNC.user.getGroups();

	}

});

$(document).on("click", ".save-user-settings-btn", function() {

	console.log($("#user_settings_form").serialize());

	$.ajax({
		type: "POST",
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=user_update&uid="+localStorage.getItem('uid'),
		data: $("#user_settings_form").serialize(),
		dataType: "JSON",
		beforeSend: function() {
		},
		success: function(response) {

			console.log(response);

		}
	});

});

$(document).on("click",".contact-ck",function(){
	btn = this;
	$(this).find("input").prop("checked", !$(this).find("input").prop("checked"));
	if($(this).find("input").prop("checked")){
		$(this).find(".checkmark:after").hide();
	}else{
		$(this).find(".checkmark:after").false();
	}
	console.log( $(this).find("input").prop("checked") );
});
/* End move button event listers*/

$('.task_type').on('change', function() {
    $('.task_type').not(this).prop('checked', false);
});


$(document).on('click', '.campaignlabel input', function(e) {
	e.stopImmediatePropagation();
	//console.log(e);
	$('.campaignlabel input').change(function(){
	    if($(this).is(":checked")) {
	        $(this).parent().addClass("active");
	    } else {
	        $(this).parent().removeClass("active");
	    }
	});
});


$(document).ready(function(){
	pageHideSlide = function(target){
		leftDialog = $(target).css("margin-left");

		if(leftDialog =="0px"){
			$(target).animate({
				marginLeft: '+=100%'
			}, slideSpeed);
			console.log(target+"hide");
		}

	}
});


$(document).on("click", "a", function(e){
	href = $(this).attr("href");
	container = $(this).attr("data-container");
	globalmenu = $(this).attr("data-globalmenu");

	console.log(container);

	if(href=="#email_page"){
		leftEmail = $("#email_dialog").css("margin-left");
		//alert(leftEmail);
		if(leftEmail !="0px"){
			$("#email_dialog").animate({
				marginLeft: '-=100%'
			}, 0);
		}
		$("#email_to").val("");
	}else{

		//globalmenu
		/*
		If footer menu is clicked, It should hide all pages ( slide page, popup )
		and go to the selected page
		*/

		if( typeof globalmenu != "undefined"){
			$(".slide-page-container").each( function(){
				pageHideSlide("#"+$(this).attr("id"));

			});
		}
		if( typeof container != "undefined"  ){

			/* the switch statement below
				usually used when user clicks cancel/back button.
				IT only closes the current dialog open or whats being targetted
				and not go back to prospects page
			*/
			pageHideSlide("#"+container);

		}
	}
});

// $(document).on("click", ".open_sms_btn", function(e){
// 	alert("clicked");
// 	window.location = "sms:+123456789?body=" + encodeURIComponent("hello there");
// });

$(document).on("click", ".goto_settings_page", (e) => {
	e.preventDefault();
	$(e.currentTarget).parent().addClass(".btn-active");

	$("#settings_page_slide").animate({
		marginLeft: '-=100%'
	}, slideSpeed);
	setTimeout( () => {
		$(e.currentTarget).parent().removeClass(".btn-active");
	}, 300);

});

/*code by nik*/

$(document).on('click', '#forgot_password_link', function(e) {

	$.mobile.changePage("#forgotpage", {
														transition: 'none',
														changeHash: true,
														role: 'page'
		});

});

//by ivey for email campaign select
$('.group_type').on('change', function() {
		$('.group_type').not(this).prop('checked', false);
});

$("#send-email-sel").on("change", (e)=>{
	field = "["+$(e.currentTarget).val()+"]";
	$("#email_body").val($("#email_body").val()+field);
});

$(document).on("change", ".select_email_template", (e) => {
	tid = $(e.currentTarget).val();
	tpl = $("#hdn-email-tpl-"+tid).val();
	subject = $("#hdn-email-tpl-subject-"+tid).val();
	$("#email_body").val(tpl);
	$("#email_subject").val(subject);
	//console.log(tpl);
});

$(document).on("click", "#contactsearch .ui-input-clear", (e) => {
	FUNC.contact.getContacts();
});




$(document).on("click", "#send-email-btn", function(e){
	e.stopImmediatePropagation();
	e.preventDefault();
	console.log($("#send-email-form").serialize());
	//FUNC.email.sendEmail('send-email-form');

	$.ajax({
		type:"POST",
		//url: "http://webserv.yooblycrm.com/?cmd=contact_add&uid="+localStorage.getItem('uid'),
		url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=send_email&uid="+localStorage.getItem('uid')+"&email_to="+$("#email_to").val()+"&email_subject="+$("#email_subject").val(),
		data: $("#send-email-form").serialize(),
		dataType: "JSON",
		beforeSend: function() {
			//$("#login_btn").val("Please wait...");
			//$("#login_btn").attr("disabled","disabled");
		},
		success: function(response) {
			console.log(response);
			$("#send-email-btn").html("Email Sent!").fadeTo("fast", 1);
			$("#send-email-result").html(response.message);

			setTimeout(function(){
				$("#send-email-result").html("");
				$("#send-email-form")[0].reset();
				$("#send-email-btn").html("Send");
			},1000);
		},
		error : function(){
			alert("Something went wrong. Please try again.");
		},
		beforeSend : function(){
			$("#send-email-btn").fadeTo("fast", .3);
		},
		complete : function(){
			$("#send-email-btn").fadeTo("fast", 1);
		}
	});

});




$(document).on('focus','input, textarea', function(e) {
	e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
    return false;
    window.scrollTo(0,0); //the second 0 marks the Y scroll pos. Setting this to i.e. 100 will push the screen up by 100px.
});

loop = 0;


$(document).on("touchmove","html,body", () => {
	$('html, body').scrollTop(0);
});
