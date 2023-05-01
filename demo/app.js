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
            coverRightNow: {
                AuthorId: "",
                CoverId: "",
                DifferentAuthor: "",
                GameId: "",
                Path: "",
                Style: "",
                Type: "",
            },
            games: [],
            gamesDisplay: [],
            searchGames: "",
            pageSize: 24,
            liked: [],
        }
    },
    watch: {
        page() {
            this.refreshGames()
            this.scanForLiked()
        },
        searchGames() {
            this.page = 0
            this.gamesDisplay = this.games.filter(game => game.GameDisplayName.toLowerCase().includes(this.searchGames.toLowerCase()))
            this.gamesDisplay = this.gamesDisplay.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize)
            setTimeout(() => {this.loadImageNum(0)}, 200)
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
                setTimeout(function() {
                    self.loadImages()
                })
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
            }
        },

        getCookie(cname) {
            let name = cname + "="
            let decodedCookie = decodeURIComponent(document.cookie)
            let ca = decodedCookie.split(';')
            for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1)
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
              }
            }
            return "";
          },
          setCookie(cname, cvalue, exdays) {
            const d = new Date()
            d.setTime(d.getTime() + (exdays*24*60*60*1000))
            let expires = "expires="+ d.toUTCString()
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
          },
          loadCovers() {
            let self = this
            let xml = new XMLHttpRequest()
            xml.open("GET", "https://projektejwkk.com/Covered/API/get/gamesOrderedByFrequency.php")
            xml.send() 
            xml.onload = function() {
                let jsonResp = JSON.parse(this.response)
                
                let games = []
                for (num in jsonResp["Message"]) {
                    let game = jsonResp["Message"][num]
                    if (game.ThumbPath.includes("webm")) { 
                        game.isImg = false
                    } else {
                        game.isImg = true
                    }
                    game.imgPath = game.ThumbPath
                    games.push(game)
                }
                self.games = games
                self.refreshGames()
            }
          },
          loadImage(imgUrl, recall, object) {
            var img = new Image() 
            img.src = imgUrl
            img.onload = () => {
                recall(object)
            }
          },
          loadImageNum(i) {
            let elem = document.getElementsByClassName("icon")[i]
            let self = this
            if (typeof(elem) == typeof(document)) {
                elem.style.backgroundImage = ""
                elem.classList.add("loading")
                let imgUrl = elem.id
                this.loadImage(imgUrl, object => {
                    if (object.id == imgUrl) {
                        object.classList.remove("selected")
                        object.classList.remove("loading")
                        object.style.background = 'url("' + imgUrl + '") no-repeat'
                        object.style.backgroundSize = "cover"
                    }
                }, elem)
            }
            if (i < document.getElementsByClassName("icon").length) {
                self.loadImageNum(i+1) 
            } else {
                self.scanForLiked()
            }
          },
          scanForLiked() {
            let elems = document.getElementsByClassName("icon")
            let searchList = {}
            for (let gameNum in this.gamesDisplay) {
                let game = this.gamesDisplay[gameNum]
                searchList[game.imgPath] = game.GameId
            }
            console.log(searchList)
            for (let elemNum in elems) {
                let elem = elems[elemNum]
                if (typeof(elem) == typeof(document)) {
                    let imgUrl = elem.id
                    if (this.liked.includes(searchList[imgUrl])) {
                        elem.classList.add("selected")
                    } else {
                        elem.classList.remove("selected")
                    }
                }
            }

            let elems2 = document.getElementsByClassName("video")
            for (let elemNum in elems2) {
                let elem = elems2[elemNum]
                if (typeof(elem) == typeof(document)) {
                    let imgUrl = elem.id
                    if (this.liked.includes(searchList[imgUrl])) {
                        elem.classList.add("selected")
                    } else {
                        elem.classList.remove("selected")
                    }
                }
            }
          },
          refreshGames() {
            let self = this
            this.gamesDisplay = this.games.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize)
            setTimeout(() => {self.loadImageNum(0)}, 200)
          },
          addToLiked(gameId) {
            if (this.liked.includes(gameId)) {
                this.liked.pop(gameId)
            } else {
                this.liked.push(gameId)
            }
            this.scanForLiked()
          },
    }, 
    created() {
        this.loadCovers()
    },
}); 