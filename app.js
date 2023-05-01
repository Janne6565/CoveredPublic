var vue = new Vue({
    el: '#app',
    data() {
        return {
            listExamples: [1214, 2, 44, 210, 240, 288, 366, 753, 575],
            listCovers: [],
            activeCover: 0
        }
    },
    methods: {
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
                    let jsonResponse = JSON.parse(this.response)
                    console.log(jsonResponse)
                    if (jsonResponse["Code"] == "200") {
                        jsonResponse = jsonResponse["Message"]
                        jsonResponse["loggedIn"] = true
                    } else {
                        jsonResponse = jsonResponse["Message"]
                        jsonResponse["loggedIn"] = false
                    }
                    recall(jsonResponse)
                }
            }
        },
        getCoversFromGame(gameId, onlyLibrary, recall) {
            let xml = new XMLHttpRequest()
            xml.open("GET", "https://projektejwkk.com/Covered/API/get/coversFromGame.php?gameId=" + gameId + "&only600900=" + onlyLibrary)
            xml.send()
            xml.onload = function() {
                recall(JSON.parse(this.response)["Message"])
            }
        },
        changeActiveCover() {
            console.log("run")
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
          echoParams(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            string += "_=" + Date.now()
            return string;
        },
    
    }, 
    created() {
        let gameThisTime = this.listExamples[parseInt(Math.random() * this.listExamples.length)]
        let self = this
        this.getCoversFromGame(gameThisTime, 1, e=>{self.listCovers = e})
        let stateCheck = setInterval(() => {
            if (document.readyState === 'complete') {
                self.initiateActiveCover();
                clearInterval(stateCheck)
            } 
        }, 100)

        let coversChanging = setInterval(self.changeActiveCover, 2000)
        
        if (self.getCookie("UserId") != "" && self.getCookie("UserAuth") != "") {
            self.checkUserLogin(e=> {
                console.log(e)
                if (e.loggedIn) {
                    window.location = "./home"
                }
            })
        }
    }
}); 