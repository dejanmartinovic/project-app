var FUNC = {

	init: function() {
		
			$("#uid").val(localStorage.getItem('uid'));

			$("[data-role='navbar']").navbar();
			$("[data-role='footer']").toolbar({theme: "a"});
	},

	user: {
		addButtonFunctions: function() {
			$('#logout').on('tap', function(e){
				FUNC.user.logoutUser();
				e.preventDefault();
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

		checkUser: function() {
			//if user has logged in once, redirect to main page. no need to relogin again
			console.log("uid - checkuser: "+localStorage.getItem('uid'));

			if (localStorage.getItem('uid') != 0) {

				// setTimeout(function(){
	   //              window.location.href='dashboard.html';    
	   //          },1500);

			}
		},

		logoutUser: function() {
			localStorage.clear();

			setTimeout(function(){
                window.location.href='index.html';    
            },1500);

		}

	},

	contact: {

		addContact: function() {

			//set uid in hidden div
			$("#uid").val(localStorage.getItem('uid'));

			$('#add-contact-btn').on('tap', function(e){
                console.log("http://webserv.yooblycrm.com/?cmd=contact_add&uid="+localStorage.getItem('uid'));
                $.ajax({
                    type:"POST",
                    url: "http://webserv.yooblycrm.com/?cmd=contact_add&uid="+localStorage.getItem('uid'),
                    data: $("#add-contact-form").serialize(),
                    dataType: "JSON",
                    beforeSend: function() {
                        //$("#login_btn").val("Please wait...");
                        //$("#login_btn").attr("disabled","disabled");
                    },
                    success: function(response) {
                    	console.log(response);
                        if (response.success != 0) {
                            $("#result-add-contact").html("Contact has been added.");

                            setTimeout(function(){
                                $("#result-add-contact").html("");
                                $('#add-contact-form')[0].reset();
                            },2000);
                        } else {
                            $("#result-add-contact").html("Oops. Something went wrong.");
                        }
                    }
                });
                
                e.preventDefault();
            });

		}

	}

}