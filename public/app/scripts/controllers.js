'use strict';

angular.module('confusionApp')
        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = true;
            $scope.showMenu = false;            
            $scope.message = "Loading ...";

            $scope.dishes= {};
            
            $scope.dishes = menuFactory.getDishes().query(
                function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });            
              
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope',  function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];            
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                console.log('sendFeedback fired!');
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    // All check are OK, so let's send the feedback to the server
                    feedbackFactory.getFeedbacks().save({ param: "myParam" },$scope.feedback, function(){
                        console.log('Data Saved: '+ $scope.feedback);
                    });

                    // Than reset all the state
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }                       
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";

            $scope.stars=[1,2,3,4,5];

            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );            
            
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};

            $scope.submitComment = function () {
               // $scope.mycomment.date = new Date().toISOString();
                this.comment.date = new Date().toISOString();
                console.log(this.comment);
                $scope.dish.comments.push(this.comment);

                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }            
        }])

        // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope','menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
            
            // Executive Chef
            $scope.leader={};
            $scope.showLeader=false;
            $scope.messageLeader="Loading...";
            $scope.leader = corporateFactory.getLeaders().get({id:0})
            .$promise.then(
                function(response){
                   $scope.leader = response;
                   $scope.showLeader = true;
                },
               function(response) {
                    $scope.messageLeader = "Error: "+response.status + " " + response.statusText;
                }
            );             


            // Promotion of the month
            $scope.promotion={};
            $scope.showPromotion=false;
            $scope.messagePromotion="Loading...";
            $scope.promotion = menuFactory.getPromotion().get({id:0})
            .$promise.then(
                function(response){
                   $scope.promotion = response;
                   $scope.showPromotion = true;
                },
               function(response) {
                    $scope.messagePromotion = "Error: "+response.status + " " + response.statusText;
                }
            ); 

            // Featured Dish
            $scope.dish = {};
            $scope.showDish = false;
            $scope.messageDish="Loading ...";       
            $scope.dish = menuFactory.getDishes().get({id:0})
            .$promise.then(
                function(response){
                   $scope.dish = response;
                   $scope.showDish = true;
                },
               function(response) {
                    $scope.messageDish = "Error: "+response.status + " " + response.statusText;
                }
            );            

        }])

        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
            

            $scope.leaders={};
            $scope.showLeaders=false;
            $scope.messageLeaders="Loading...";
            $scope.leaders = corporateFactory.getLeaders().query(
                function(response) {
                    $scope.leaders = response;
                    $scope.showLeaders = true;
                },
                function(response) {
                    $scope.messageLeaders = "Error: "+response.status + " " + response.statusText;
                });
        }])        

;