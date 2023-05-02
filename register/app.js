var vue = new Vue({
    el: '#app',
    data() {
        return {
            listExamples: [10, 11, 13, 14, 23, 24, 34, 30, 28, 43, 46, 51, 52, 54, 56],
            listCovers: [],
            activeCover: 0,
            userData: {
                userName: "",
                userEmail: "",
                steamId: "",
                userPassword: "",
            },
            isErrorInRegister: false,
            isSteamError: false,
            isLoading: false,
        }
    },
    methods: {
        getCoversFromGame(gameId, onlyLibrary, recall) {
            let xml = new XMLHttpRequest()
            xml.open("GET", "https://projektejwkk.com/Covered/API/get/coversFromGame.php?gameId=" + gameId + "&only600900=" + onlyLibrary)
            xml.send()
            xml.onload = function() {
                recall(JSON.parse(this.response)["Message"])
            }
        },
        registerUser() {
            let self = this
            self.isLoading = true
            console.log("Registering user...")
            if (!this.isErrorInRegister) {
                this.checkUserSteam(e => {
                    if (e == "true") {
                        console.log("Steam ID is valid")
                        let xml = new XMLHttpRequest()
                        xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/create/user.php", self.userData))
                        console.log("URL: " + self.echoParams("https://projektejwkk.com/Covered/API/create/user.php", self.userData))
                        xml.send()
                        xml.onload = function() {
                            let jsonResponse = JSON.parse(this.response)
                            console.log(this.response)
                            if (jsonResponse["Code"] == "200") {
                                let userData = jsonResponse["Message"]
                                self.userInfos = userData
                                self.setCookies()
                                window.location = "../"
                                self.isLoading = false
                                console.log("User registered !")
                            }
                        }
                    } else {
                        this.isSteamError = true
                    }
                })
            }   
        },
        checkUserSteam(recall) {
            let xml = new XMLHttpRequest()
            xml.open("GET", "https://projektejwkk.com/Covered/API/check/steamId.php?steamId=" + this.userData.steamId)
            xml.send() 
            xml.onload = function() {
                recall(this.response)
            }

        },
        checkUsername() {
            let self = this
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/search/existsUserWithUsername.php", self.userData))
            xml.send()
            xml.onload = function () {
                let jsonResponse = JSON.parse(this.response)
                self.isErrorInRegister = (jsonResponse.Code == 201) 
            }
        },
        changeActiveCover() {
            if (document.readyState === 'complete') {
                let covers = document.getElementsByClassName("covers")[0]
                let coversList = covers.getElementsByClassName("oneCover")
                coversList[this.activeCover].classList.toggle("activeCover")
                this.activeCover += 1
                if (this.activeCover >= this.listCovers.length) {
                    this.activeCover = 0
                }
                coversList[this.activeCover].classList.toggle("activeCover")
                return true;
            } else {
                console.log("Not loaded yet")
                return false;
            }
        },
        initiateActiveCover() {
            if (document.readyState === 'complete') {
                let covers = document.getElementsByClassName("covers")[0]
                let coversList = covers.getElementsByClassName("oneCover")
                coversList[0].classList.toggle("activeCover")
                return true;
            } else {
                return false;
            }
        },
        echoParams(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            string += "_=" + Date.now()
            return string;
        },
        setCookies() {
            if (this.userInfos.UserId != "" && this.userInfos.UserAuth != "") {
                this.setCookie("UserId", this.userInfos.UserId, 30)
                this.setCookie("UserAuth", this.userInfos.UserAuth, 30)
            } else {
                console.log("Not Logged in")
            }
        },

        getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          },
          setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          }
    }, 
    created() {
        let gameThisTime = this.listExamples[parseInt(Math.random() * this.listExamples.length)]
        let self = this
        this.getCoversFromGame(gameThisTime, 1, e=>{self.listCovers = e})
        let stateCheck = setInterval(() => {
            if (document.readyState === 'complete') {
                self.initiateActiveCover()
                clearInterval(stateCheck)
            } 
        }, 100)
        let coversChanging = setInterval(self.changeActiveCover, 2000)
    }
}); 