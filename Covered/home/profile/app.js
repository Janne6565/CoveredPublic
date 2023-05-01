var vue = new Vue({
    el: '#app',
    data() {
        return {
            userData: {
                UserName: "",
                UserEmail: "",
                SteamId: "",
                UserPassword: "",
                UserAuth: "",
            },
            page: 0,
            listLists: [
                [{Path:"https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/168359f1c037f24fd6ca3d92d9e79b24.png"}]
            ],
            listLiked: [
                {Path: ""}
            ],
            isList: 'true',
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
        checkUserLogin(recall) {
            if (this.getCookie("UserId") != "" && this.getCookie("UserAuth") != "") {
                let xml = new XMLHttpRequest() 
                xml.open("GET", this.echoParams("https://projektejwkk.com/Covered/API/get/userDetails.php", {
                    userId: this.getCookie("UserId"),
                    userAuth: this.getCookie("UserAuth"),
                }))
                xml.send() 
                let self = this
                xml.onload = function() {
                    let jsonResponse = JSON.parse(this.response)["Message"]
                    if (jsonResponse["Code"] == "200") {
                        jsonResponse["loggedIn"] = true
                    } else {
                        jsonResponse["loggedIn"] = false
                    }
                    recall(jsonResponse)
                }
            }
        },
        getUserLists(recall) {
            let self = this
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/get/userLists.php", {
                userId: userId, 
                userAuth: userAuth,
            }))
            xml.send() 
            xml.onload = function() {
                let jsonResponse = JSON.parse(this.response)
                let lists = jsonResponse["Message"]
                self.listLists = lists
                console.log(self.listLists)
                setTimeout(recall(), 1)
            }
        },
        getUserSaved(recall) {
            let self = this
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/get/savedCovers.php", {
                userId: userId, 
                userAuth: userAuth,
            }))
            xml.send() 
            xml.onload = function() {
                let jsonResponse = JSON.parse(this.response)
                let lists = jsonResponse["Message"]
                self.listLiked = lists
                setTimeout(function() {recall()}, 1)
            }
        },
        loadRecommended() {
            let self = this
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/discover/covers.php", {
                userId: userId, 
                userAuth: userAuth,
                only600900: "1"
            }))
            xml.send() 
            xml.onload = function() {
                let jsonResponse = JSON.parse(this.response)
                let covers = jsonResponse["Message"]
                self.coverRightNow = covers[0]
            }
        },
        addCoverToList(coverId, gameId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/toList.php", {
                userId: userId,
                userAuth: userAuth,
                coverId: coverId,
                gameId: gameId
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        removeCover(coverId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/coverToDisliked.php", {
                userId: userId,
                userAuth: userAuth,
                coverId: coverId,
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        removeGame(gameId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/gameToNotShown.php", {
                userId: userId,
                userAuth: userAuth,
                gameId: gameId,
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        saveCover(coverId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/coverToLiked.php", {
                userId: userId,
                userAuth: userAuth,
                coverId: coverId,
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        getCurrentCoverFromGame(gameId, recall) {
            let self = this
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/get/equipedCover.php", {
                userId: userId, 
                userAuth: userAuth,
                gameId: gameId
            }))
            xml.send()
            xml.onload = function() {
                recall(JSON.parse(this.response))
            }
        },
        registerUser() {
            if (!this.isErrorInRegister) {
                let self = this
                let xml = new XMLHttpRequest()
                xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/create/user.php", self.userData))
                xml.send()
                xml.onload = function() {
                    let jsonResponse = JSON.parse(this.response)
                    if (jsonResponse["Code"] == "200") {
                        let userData = jsonResponse["Message"]
                        self.userInfos = userData
                        self.setCookies()
                    }
                }
            }
        },
        checkUsername() {
            let self = this
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/search/existsUserWithUsername.php", self.userData))
            xml.send()
            xml.onload = function () {
                let jsonResponse = JSON.parse(this.response)
                console.log(jsonResponse)
                self.isErrorInRegister = (jsonResponse.Code == 201) 
            }
        },
        changeActiveCover() {
            if (document.readyState === 'complete') {
                let covers = document.getElementsByClassName("covers")[0]
                let coversList = covers.getElementsByClassName("oneCover")
                console.log(coversList[this.activeCover])
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
          },
          loadImage(imgUrl, recall, object) {
            var img = new Image() 
            img.onload = function() {
                recall(object)
            }
            img.src = imgUrl
          },
          loadImageNum(i) {
            let elem = document.getElementsByClassName("toLoad")[i]
            let self = this
            if (typeof(elem) == typeof(document)) {
                let imgUrl = elem.id
                if (elem.id.includes("webm")) {
                    let video = document.createElement("video")
                    let source = document.createElement("source")
                    source.src = elem.id
                    video.appendChild(source)
                    video.autoplay = true
                    video.muted = true
                    video.loop = true
                    console.log(video)
                    elem.id = ""
                    elem.classList.remove("loading")
                    elem.appendChild(video)
                } else {    
                    elem.style.backgroundImage = ""
                    elem.classList.add("loading")
                    this.loadImage(imgUrl, object => {
                        object.id = ""
                        object.classList.remove("loading")
                        object.style.backgroundImage = 'url("' + imgUrl + '")'
                    }, elem)
                }
            }
            console.log(document.getElementsByClassName("toLoad")[i])
            if (i < document.getElementsByClassName("toLoad").length) {
                self.loadImageNum(i+1) 
            }
        },
    }, 
    created() {
        let self = this
        this.checkUserLogin(e => {
            if (e.loggedIn = false) {
                window.location = ".../"
            } else {
                self.userData = e
                self.getUserLists(function() {
                    self.getUserSaved(function() {
                        self.loadImageNum(0)
                    })
                })
            }
        })
    }
});