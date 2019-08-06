var connectionStatus = false;

var FUNC = {

	init: function() {

			//var attachFastClick = Origami.fastclick;
			//attachFastClick(document.body);

			connectionStatus = navigator.onLine ? 'online' : 'offline';
			//alert(connectionStatus);

			//console.log(localStorage.getItem('uid'));
			$("#uid").val(localStorage.getItem('uid'));

			//start universal footer nav
			$("[data-role='navbar']").navbar();
			$("[data-role='footer']").toolbar({theme: "a"});

			var hash = location.hash.substr(1);
			console.log(hash);
			if (hash == "login" || hash == "") {
                //$("div[data-role=footer]").slideToggle(200);
                $("div[data-role=footer]").hide();
            } else {
            	$("div[data-role=footer]").show();
            }

			$.event.special.tap = {
			  setup: function() {
			    var self = this,
			      $self = $(self);

			    $self.on('touchstart', function(startEvent) {
			      var target = startEvent.target;

			      $self.one('touchend', function(endEvent) {
			        if (target == endEvent.target) {
			          $.event.simulate('tap', self, endEvent);
			        }
			      });
			    });
			  }
			};

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


			// hide the footer when input is active
			var _originalSize = $(window).width() + $(window).height()
			  $(window).resize(function(){
			    if($(window).width() + $(window).height() != _originalSize){
			      //alert("keyboard show up");
			      $.mobile.activePage.find("div[data-role='footer']").hide();
			    }else{
			      //alert("keyboard closed");
			      $.mobile.activePage.find("div[data-role='footer']").show();
			    }
			  });

			FUNC.user.checkUser();
			FUNC.navigation.footerNavbarInit();
			FUNC.sync.syncContact();
			FUNC.email.init();
			//$('#contact_table').DataTable();

			//localStorage.removeItem('contacts');
			//console.log(localStorage.removeItem('offline_contacts_delete'));
	},

	sync: {

		syncContact: function() {

			$('#sync-contact-btn').on('tap', function() {
				if (!connectionStatus) {
					alert("No internet connection.");
				} else {

					//console.log(localStorage.getItem('contacts'));

					FUNC.sync.addOfflineContact();
					FUNC.sync.removeOfflineContact();
					FUNC.contact.updateContacts();
					FUNC.contact.updateContactsTodaysCall();
					FUNC.contact.updateContactsNewMembers();
					FUNC.contact.updateContactsTeam();

					$("#dynamic_dialog #dialog_content div").html("Contacts synced.");
		            $.mobile.changePage("#dynamic_dialog", {
								            transition: 'none',
								            changeHash: true,
								            role: 'dialog'
										});

		            setTimeout(function(){
						$('.ui-dialog').dialog('close');
						localStorage.removeItem('offline_contacts');
						localStorage.removeItem('offline_contacts_delete');
						FUNC.contact.getContacts();
						//FUNC.contact.showContacts();
					},1500);

				}

			});

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
		            	},700);

	            	// } else {

	            	// 	$("#todays_content_wrapper").html("<div class='noff'><center><h1>You have no more<br>follow-ups for today.</h1></center><br><img src='images/like.png' width='100' style='margin-top: 100px;'/></div>");

	            	// }
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
							div_task_content += "<div class='align-left contact_info contact_details' data-cid='"+call[i].contact.cid+"' style='padding-left: 10%;'>";
							div_task_content += "<li><h1><a href='#' class='' >"+call[i].contact.first_name+" "+call[i].contact.last_name+"</a></h1></li>";
							div_task_content += "<li>"+k+" - "+formattedDate+"</li>";
		   					//div_task_content += "<li>"+call[i].contact.phone+"</li>";

				            div_task_content += "</div></ul>";

			        	}

				    });

			    });

				$("#todays_content").html(div_task_content);

				$('.contact_details').on('mouseup touchend', function(e) {
		        	e.stopImmediatePropagation();
					console.log(e);
					//alert("touchend");
					var contact_cid = e.currentTarget.attributes[1].nodeValue;

					//$("#view_contact_back_btn").attr("href","#today");

					FUNC.user.showContactDetailsTask(contact_cid);

				});
			}



		},

		showContactDetails: function(cid) {

			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				var contact_details_content = "";
				var contact_email = "";
				var contact_group = "";
				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {
						contact_email = contacts[i].email;
						console.log(contacts[i]);

						contact_details_content += "<div><h1>"+contacts[i].first_name+" "+contacts[i].last_name+"</h1></div>";
						contact_details_content += "<div>"+contacts[i].email+"</div>";
						contact_details_content += "<div>"+contacts[i].address+"</div>";
						contact_details_content += "<div class='iconwrappercontact'>";
						contact_details_content += "<div class='iconscontacts align-left'><img src='images/phoneicon.png' width='40'/><span>Call</span></div>";
						contact_details_content += "<div class='iconscontacts align-left'><img src='images/chaticon.png' width='40'/><span>Text</span></div>";
						contact_details_content += "<div class='iconscontacts align-left' id='email-composer-btn'><img src='images/emailicon.png' width='40'/><span>Email</span></div>";
						contact_details_content += "<div class='iconscontacts align-left edit_contact_btn' data-cid='"+contacts[i].cid+"'><img src='images/editicon.png' width='40'/><span>Edit</span></div>";
						contact_details_content += "</div>";
						contact_details_content += "<div class='viewcontactselect ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow'>";
						contact_details_content += '<select id="contact_group" name="gid"><option value="0">Select Group</option><option value="193">Email Pending</option><option value="202">Do Not Pipeline</option></select>';
						contact_details_content += "</div>";
						contact_details_content += "<div class='viewcontactselect ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow'>";
						contact_details_content += '<select id="contact_campaigns" name="cp_gid"><option value="0">Select Campaign</option><option value="17426">test campaign</option></select>';
						contact_details_content += "</div>";
						contact_details_content += "<div>Appointments</div><div>Email</div><div>Tasks</div>";
						//contact_details_content += '<button id="contact-email-composer-btn" class="ui-btn">Email</button>';
						contact_details_content += '<a href="#prospect" data-mini="true" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/></a>';

					}

				}

				console.log(contact_details_content);

				$("#dynamic_dialog #dialog_content div").html(contact_details_content);
	            $.mobile.changePage("#dynamic_dialog", {
							            transition: 'none',
							            changeHash: true,
							            role: 'dialog'
							        });

	            $("#contact-email-composer-btn").on('tap', function(e){
	            	//console.log(contact_email);
	            	$("#email_to").val(contact_email);

					$.mobile.changePage("#email_dialog", {
			            transition: 'none',
			            changeHash: true,
			            role: 'dialog'
			        });

			        e.stopImmediatePropagation();

				});

				$('.edit_contact_btn').on('tap', function(e){

					console.log(e.currentTarget.attributes[1].nodeValue);
					FUNC.user.editContact(e.currentTarget.attributes[1].nodeValue);
					e.stopImmediatePropagation();
				});

			}

		},

		showContactDetailsTask: function(cid) {

			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				var contact_details_content = "";
				var contact_email = "";
				var contact_group = "";
				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {
						contact_email = contacts[i].email;
						console.log(contacts[i]);

						contact_details_content += "<div><h1>"+contacts[i].first_name+" "+contacts[i].last_name+"</h1></div>";
						contact_details_content += "<div>"+contacts[i].email+"</div>";
						contact_details_content += "<div>"+contacts[i].address+"</div>";
						contact_details_content += "<div class='iconwrappercontact'>";
						contact_details_content += "<div class='iconscontacts align-left'><img src='images/phoneicon.png' width='40'/><span>Call</span></div>";
						contact_details_content += "<div class='iconscontacts align-left'><img src='images/chaticon.png' width='40'/><span>Text</span></div>";
						contact_details_content += "<div class='iconscontacts align-left' id='email-composer-btn'><img src='images/emailicon.png' width='40'/><span>Email</span></div>";
						contact_details_content += "<div class='iconscontacts align-left edit_contact_btn' data-cid='"+contacts[i].cid+"'><img src='images/editicon.png' width='40'/><span>Edit</span></div>";
						contact_details_content += "</div>";
						contact_details_content += "<div class='viewcontactselect ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow'>";
						contact_details_content += '<select id="contact_group" name="gid"><option value="0">Select Group</option><option value="193">Email Pending</option><option value="202">Do Not Pipeline</option></select>';
						contact_details_content += "</div>";
						contact_details_content += "<div class='viewcontactselect ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow'>";
						contact_details_content += '<select id="contact_campaigns" name="cp_gid"><option value="0">Select Campaign</option><option value="17426">test campaign</option></select>';
						contact_details_content += "</div>";
						contact_details_content += "<div>Appointments</div><div>Email</div><div>Tasks</div>";
						//contact_details_content += '<button id="contact-email-composer-btn" class="ui-btn">Email</button>';
						contact_details_content += '<a href="#today" data-mini="true" class="ui-btn custom_btn"><img src="images/backarrow.png" width="10"/></a>';

					}

				}

				$("#dynamic_dialog #dialog_content div").html(contact_details_content);
	            $.mobile.changePage("#dynamic_dialog", {
							            transition: 'none',
							            changeHash: true,
							            role: 'dialog'
							        });

	            $("#contact-email-composer-btn").on('tap', function(e){
	            	//console.log(contact_email);
	            	$("#email_to").val(contact_email);

					$.mobile.changePage("#email_dialog", {
			            transition: 'none',
			            changeHash: true,
			            role: 'dialog'
			        });

			        e.stopImmediatePropagation();

				});

				$('.edit_contact_btn').on('tap', function(e){

					console.log(e.currentTarget.attributes[1].nodeValue);
					FUNC.user.editContact(e.currentTarget.attributes[1].nodeValue);
					e.stopImmediatePropagation();
				});

			}

		},

		editContact: function(cid, page_from = null) {


			if (page_from != null) {
				page_from = "#"+page_from;
			} else {
				page_from = "#prospect";
			}

			if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

				var edit_contact_content = "";
				var contact_email = "";
				var contact_group = "";
				// READ STRING FROM LOCAL STORAGE
				var retrievedContacts = localStorage.getItem('contacts');

				// CONVERT STRING TO REGULAR JS OBJECT
				var contacts = JSON.parse(retrievedContacts);
				//console.log(parsedObject[0].fullname);

				for(var i = 0; i < contacts.length; i++) {

					if (contacts[i].cid == cid) {
						contact_email = contacts[i].email;

						edit_contact_content += '<div id="contact-form">';
						edit_contact_content += '<div id="result-edit-contact"></div>';
						edit_contact_content += '<form id="edit-contact-form" method="POST" action="#"  data-ajax="false">';
						edit_contact_content += '<div id="topheaderform" style="position:unset;">';
						edit_contact_content += '<ul>';
						edit_contact_content += '<li>Edit Contact</li>';
						edit_contact_content += '<li><input id="save-contact-btn" type="button" data-mini="true" class="custom_btn" name="" value="Save"></li>';
						edit_contact_content += '</ul>';
						edit_contact_content += '</div>';
						edit_contact_content += '<div id="formwrapper">';

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
						edit_contact_content += '<input type="text" id="phone" name="phone" placeholder="Phone" value="'+contacts[i].phone+'">';
						edit_contact_content += '</div>';

						edit_contact_content += '</div>';
						edit_contact_content += '</form>';
						edit_contact_content += '</div>';

					}

				}

				$("#dynamic_dialog #dialog_content div").html(edit_contact_content);
	            $.mobile.changePage("#dynamic_dialog", {
							            transition: 'none',
							            changeHash: true,
							            role: 'dialog'
							        });

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
			            		$("#result-edit-contact").html("Contact saved!");
			            	} else {
			            		$("#result-edit-contact").html("Error updating contact.");
			            	}

			            	setTimeout(function(){
			            		$("#result-edit-contact").html("");
			            	},1500);

		                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

			            }
			        });

	            	e.stopImmediatePropagation();
	            });
			}

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

	                $.each(response, function(index) {
			            console.log(response[index].uid);

			            $("#add-contact-form #campaigns").append("<option value='"+response[index].cp_gid+"'>"+response[index].name+"</option>");

			        });

                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

	            }
	        });

		},

		getGroups: function() {
			//console.log("http://webserv.yooblycrm.com/?cmd=groups_get&uid="+localStorage.getItem('uid'));
			var grp_content = "";

			$.ajax({
	            type: "GET",
	            url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=groups_get&uid="+localStorage.getItem('uid'),
	            //data: $("#login-form").serialize(),
	            dataType: "JSON",
	            beforeSend: function() {
	            },
	            success: function(response) {

	            	$.each(response, function(index) {
			            //console.log(response[index].name);
			            if (response[index].gid == "193" || response[index].gid == "202") { // allow only email pending and do not pipeline to show as default group
			            	$("#add-contact-form #group").append("<option value='"+response[index].gid+"'>"+response[index].name+"</option>");
			            }

			        });

                    //$("#hdn-inputs").append("<input type='hidden' id='uid' value='"+response.uid+"'>");

	            }
	        });

		},

		checkUser: function() {
			//if user has logged in once, redirect to main page. no need to relogin again
			var hash = location.hash.substr(1);
			//console.log("hash: "+hash);
			if (hash == "" || hash == "login") {
				if (localStorage.getItem('uid') != null) {

					setTimeout(function(){
		                window.location.hash='#today';
		            },500);

				}
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


				$(".email-composer-btn").on('tap', function(e){
					e.stopImmediatePropagation();

					if (connectionStatus == "online") {

						$("#from").val(localStorage.getItem('email'));

						$("#email_to").val("");

						$.mobile.changePage("#email_dialog", {
				            transition: 'none',
				            changeHash: true,
				            role: 'dialog'
				        });

			        } else {

						alert("You must have an active internet connection to use email fu");

					}

				});


			$("#send-email-btn").on('tap', function(e){
				e.stopImmediatePropagation();
				//console.log($("#send-email-form").serialize());
				//FUNC.email.sendEmail('send-email-form');
				$.ajax({
                    type:"POST",
                    //url: "http://webserv.yooblycrm.com/?cmd=contact_add&uid="+localStorage.getItem('uid'),
                    url: "http://ernest.qfautopilot.com/web_api/web_api.php?cmd=send_email&uid="+localStorage.getItem('uid')+"&email_to="+$("#email_to").val()+"&email_subject="+$("#email_subject").val()+"&email_body="+$("#email_body").val(),
                    data: $("#add-contact-form").serialize(),
                    dataType: "JSON",
                    beforeSend: function() {
                        //$("#login_btn").val("Please wait...");
                        //$("#login_btn").attr("disabled","disabled");
                    },
                    success: function(response) {
                    	console.log(response);
                        alert(response.message);
                    }
                });

			});

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
				table_content_all_contacts += "<form id='form_contact' method='POST' action=''>";

				//show offline added contacts
				//console.log(localStorage.getItem('offline_contacts'));

				if (localStorage.getItem('offline_contacts') !== null) {

					var offlineContacts = localStorage.getItem('offline_contacts');
					var parsedContacts = JSON.parse(offlineContacts);

					for(var i = 0; i < parsedContacts.length; i++) {
						//console.log(parsedContacts[i].fullname);

			    		table_content_all_contacts += "<ul id='div-"+parsedContacts[i].cid+"' class='listcontactwrapper' >";
						table_content_all_contacts += "<div class='contactcheck align-left'><label class='contactcheckwrap'><input type='checkbox' value='"+parsedContacts[i].cid+"' id='' name='checked_contact[]' class='contact-checkbox'/><span class='checkmark'></span></label></div>";
						table_content_all_contacts += "<div class='align-left contact_info contact_details_prospect' data-cid='"+parsedContacts[i].cid+"'>";
						table_content_all_contacts += "<li><h1><a href='#'>"+parsedContacts[i].first_name+" "+parsedContacts[i].last_name+"</a></h1></li>";
						table_content_all_contacts += "<li>"+parsedContacts[i].email+"</li>";
	   					table_content_all_contacts += "<li>"+parsedContacts[i].phone+"</li>";


					    if (typeof parsedContacts[i].groups != "undefined")
						{
						    // variable is not undefined

						    table_content_all_contacts += "";
						    for(var j = 0; j < parsedContacts[i].groups.length; j++) {
						    	table_content_all_contacts += parsedContacts[i].groups[j].name+", ";
						    }
						    table_content_all_contacts += "</li>";

						} else {
							table_content_all_contacts += "<li></li>";
						}

						if (typeof parsedContacts[i].campaign != "undefined")
						{
						    // variable is not undefined
						    table_content_all_contacts += "<li>"+parsedContacts[i].campaign.name+"</li>";

						} else {
							table_content_all_contacts += "<li></li>";
						}

			            table_content_all_contacts += "</div></ul>";
					}

				}

				if (typeof localStorage.getItem('contacts') !== 'undefined' && localStorage.getItem('contacts') !== null) {

					// READ STRING FROM LOCAL STORAGE
					var retrievedObject = localStorage.getItem('contacts');

					// CONVERT STRING TO REGULAR JS OBJECT
					var parsedObject = JSON.parse(retrievedObject);
					//console.log(parsedObject[0].fullname);

					for(var i = 0; i < parsedObject.length; i++) {

						//console.log(parsedObject[i].fullname);

			    		table_content_all_contacts += "<ul id='div-"+parsedObject[i].cid+"' class='listcontactwrapper ' >";
						table_content_all_contacts += "<div class='contactcheck align-left'><label class='contactcheckwrap'><input type='checkbox' value='"+parsedObject[i].cid+"' id='' name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span></label></div>";
						table_content_all_contacts += "<div class='align-left contact_info'>";
						table_content_all_contacts += "<li><h1>"+parsedObject[i].first_name+" "+parsedObject[i].last_name+"</h1></li>";
						//table_content_all_contacts += "<li>"+parsedObject[i].email+"</li>";
						//table_content_all_contacts += "<li>"+parsedObject[i].phone+"</li>";


					    // if (typeof parsedObject[i].groups != "undefined")
						// {
						//     // variable is not undefined

						//     table_content_all_contacts += "<li>";
						//     for(var j = 0; j < parsedObject[i].groups.length; j++) {
						//     	table_content_all_contacts += parsedObject[i].groups[j].name+", ";
						//     }
						//     table_content_all_contacts += "</li>";

						// } else {
						// 	table_content_all_contacts += "<li></li>";
						// }

						// if (typeof parsedObject[i].campaign != "undefined")
						// {
						//     // variable is not undefined
						//     table_content_all_contacts += "<li>"+parsedObject[i].campaign.name+"</li>";

						// } else {
						// 	table_content_all_contacts += "<li></li>";
						// }

			            table_content_all_contacts += "</div>";
			            table_content_all_contacts += "<div>";
						table_content_all_contacts += "<li><a href='#' class='contact_details_prospect' data-cid='"+parsedObject[i].cid+"' style='font-size:20px;'> > </a></li>";
			            table_content_all_contacts += "</div>";
			            table_content_all_contacts += "</ul>";
					}
				}

		        table_content_all_contacts += "</form>";
		        //console.log(table_content_all_contacts);
		        $("#allcontacts #contact_table").html(table_content_all_contacts);


		        $('.contact_details_prospect').on('tap', function(e) {
		        	e.stopImmediatePropagation();
					//console.log(e);

					var contact_cid = e.currentTarget.attributes[2].nodeValue;
					console.log(contact_cid);
					FUNC.user.showContactDetails(contact_cid);

				});


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

					for(var i = 0; i < parsedObject.length; i++) {

						//console.log(parsedObject[i].fullname);

			    		table_content_todayscall += "<ul id='div-"+parsedObject[i].cid+"' class='listcontactwrapper'>";
						table_content_todayscall += "<div class='contactcheck align-left'><label class='contactcheckwrap'><input type='checkbox' value='"+parsedObject[i].cid+"' id='' name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span></label></div>";
						table_content_todayscall += "<div class='align-left contact_info contact_details_prospect' data-cid='"+parsedObject[i].cid+"'>";
						table_content_todayscall += "<li><h1><a href='#' class='' >"+parsedObject[i].first_name+" "+parsedObject[i].last_name+"</a></h1></li>";
						table_content_todayscall += "<li>"+parsedObject[i].email+"</li>";
						table_content_todayscall += "<li>"+parsedObject[i].phone+"</li>";


					    if (typeof parsedObject[i].groups != "undefined")
						{
						    // variable is not undefined

						    table_content_todayscall += "<li>";
						    for(var j = 0; j < parsedObject[i].groups.length; j++) {
						    	table_content_todayscall += parsedObject[i].groups[j].name+", ";
						    }
						    table_content_todayscall += "</li>";

						} else {
							table_content_todayscall += "<li></li>";
						}

						if (typeof parsedObject[i].campaign != "undefined")
						{
						    // variable is not undefined
						    table_content_todayscall += "<li>"+parsedObject[i].campaign.name+"</li>";

						} else {
							table_content_todayscall += "<li></li>";
						}

			            table_content_todayscall += "</div></ul>";
					}
				}

		        table_content_todayscall += "</form>";

		        $("#todayscall_contact").html(table_content_todayscall);

		        $('.contact_details_prospect').on('mouseup touchend', function(e) {
					//console.log(e.currentTarget.attributes[2].nodeValue);

					var contact_cid = e.currentTarget.attributes[1].nodeValue;

					FUNC.user.showContactDetails(contact_cid);

				});

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

					for(var i = 0; i < parsedObject.length; i++) {

						//console.log(parsedObject[i].fullname);

			    		table_content_lastdays += "<ul id='div-"+parsedObject[i].cid+"' class='listcontactwrapper'>";
						table_content_lastdays += "<div class='contactcheck align-left'><label class='contactcheckwrap'><input type='checkbox' value='"+parsedObject[i].cid+"' id='' name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span></label></div>";
						table_content_lastdays += "<div class='align-left contact_info contact_details_prospect' data-cid='"+parsedObject[i].cid+"'>";
						table_content_lastdays += "<li><h1><a href='#' class='' >"+parsedObject[i].first_name+" "+parsedObject[i].last_name+"</a></h1></li>";
						table_content_lastdays += "<li>"+parsedObject[i].email+"</li>";
						table_content_lastdays += "<li>"+parsedObject[i].phone+"</li>";


					    if (typeof parsedObject[i].groups != "undefined")
						{
						    // variable is not undefined

						    table_content_lastdays += "<li>";
						    for(var j = 0; j < parsedObject[i].groups.length; j++) {
						    	table_content_lastdays += parsedObject[i].groups[j].name+", ";
						    }
						    table_content_lastdays += "</li>";

						} else {
							table_content_lastdays += "<li></li>";
						}

						if (typeof parsedObject[i].campaign != "undefined")
						{
						    // variable is not undefined
						    table_content_lastdays += "<li>"+parsedObject[i].campaign.name+"</li>";

						} else {
							table_content_lastdays += "<li></li>";
						}

			            table_content_lastdays += "</div></ul>";
					}
				}

		        table_content_lastdays += "</form>";

		        $("#lastdaysdata").html(table_content_lastdays);

		        $('.contact_details_prospect').on('mouseup touchend', function(e) {
					//console.log(e.currentTarget.attributes[2].nodeValue);

					var contact_cid = e.currentTarget.attributes[1].nodeValue;

					FUNC.user.showContactDetails(contact_cid);

				});

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

					for(var i = 0; i < parsedObject.length; i++) {

						//console.log(parsedObject[i].fullname);

			    		table_content_team += "<ul id='div-"+parsedObject[i].cid+"' class='listcontactwrapper'>";
						table_content_team += "<div class='contactcheck align-left'><label class='contactcheckwrap'><input type='checkbox' value='"+parsedObject[i].cid+"' id='' name='checked_contact[]' class='contact-checkbox' /><span class='checkmark'></span></label></div>";
						table_content_team += "<div class='align-left contact_info contact_details_prospect' data-cid='"+parsedObject[i].cid+"'>";
						table_content_team += "<li><h1><a href='#' class='' >"+parsedObject[i].first_name+" "+parsedObject[i].last_name+"</a></h1></li>";
						table_content_team += "<li>"+parsedObject[i].email+"</li>";
						table_content_team += "<li>"+parsedObject[i].phone+"</li>";


					    if (typeof parsedObject[i].groups != "undefined")
						{
						    // variable is not undefined

						    table_content_team += "<li>";
						    for(var j = 0; j < parsedObject[i].groups.length; j++) {
						    	table_content_team += parsedObject[i].groups[j].name+", ";
						    }
						    table_content_team += "</li>";

						} else {
							table_content_team += "<li></li>";
						}

						if (typeof parsedObject[i].campaign != "undefined")
						{
						    // variable is not undefined
						    table_content_team += "<li>"+parsedObject[i].campaign.name+"</li>";

						} else {
							table_content_team += "<li></li>";
						}

			            table_content_team += "</div></ul>";
					}
				}

		        table_content_team += "</form>";

		        $("#teamdata").html(table_content_team);

		        $('.contact_details_prospect').on('mouseup touchend', function(e) {
					//console.log(e.currentTarget.attributes[2].nodeValue);

					var contact_cid = e.currentTarget.attributes[1].nodeValue;

					FUNC.user.showContactDetails(contact_cid);

				});

			},700);
		},

		showContacts: function() {

		},
		removeContact: function() {

			$(document).on('tap', '#delete-contact-btn', function(e){

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

							$("#dynamic_dialog #dialog_content div").html(response.success+" contact(s) removed.");
				            $.mobile.changePage("#dynamic_dialog", {
										            transition: 'none',
										            changeHash: true,
										            role: 'dialog'
										        });

				            localStorage.removeItem('contacts');
				            FUNC.contact.getContacts();

				            setTimeout(function(){

								FUNC.contact.getContacts();
								$('.ui-dialog').dialog('close');

							},1500);
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


						$("#dynamic_dialog #dialog_content div").html(deleted_contacts+" contact(s) removed.");
				            $.mobile.changePage("#dynamic_dialog", {
										            transition: 'none',
										            changeHash: true,
										            role: 'dialog'
										        });

				        $("#div-"+$(this).val()).remove();
				        setTimeout(function(){

							$('.ui-dialog').dialog('close');

						},1500);

					});


				}

				e.preventDefault();
			});

		},
		addContact: function() {

			//set uid in hidden div
			$("#uid").val(localStorage.getItem('uid'));

            $(document).on('tap', '#add-contact-btn', function(e){

            	if ($("#first_name").val() == "" && $("#last_name").val() == "" && $("#email").val() == "") {
					//$("#result-add-contact").html("Email should not be empty.");
					$("#contact_error_btn").click();
					//$.mobile.changePage( "#myDialog", { role: "dialog" } );

					setTimeout(function(){
						$('.ui-dialog').dialog('close')
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
		                    	console.log(response);
		                        if (response.success != 0) {
		                            //$("#result-add-contact").html("Contact has been added.");

		                            var olddata = JSON.parse(localStorage.getItem('contacts')) || [];

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
									localStorage.setItem('contacts', JSON.stringify(data));

									$.mobile.changePage("#sucess_page");

		                            setTimeout(function(){
		                                $("#result-add-contact").html("");
		                                $('#add-contact-form')[0].reset();
		                            },2000);
		                        } else {

		                            $("#result-add-contact").html("Oops. Something went wrong.");

		                        }
		                    }
		                });
					} else {
						FUNC.contact.addContactOffline();
					}

				}

				e.stopImmediatePropagation();
                e.preventDefault();

        	});

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
			$.mobile.changePage("#sucess_page");
		}

	}

}

if (cordova.platformId == 'android') {

	document.addEventListener('deviceready', function(){
		StatusBar.backgroundColorByHexString('#ffffff');
	});

}else{
	document.addEventListener('deviceready', function(){
		StatusBar.backgroundColorByHexString('#ffffff');
	});
}