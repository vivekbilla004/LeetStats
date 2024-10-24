document.addEventListener("DOMContentLoaded",function(){
    const inputButton = document.getElementById("input")
    const searchButton = document.getElementById("button")
    const statscontainer = document.querySelector(".statscontainer")
    const easyProgressCircle = document.querySelector(".easy-progress");
    const MediumProgressCircle = document.querySelector(".Medium-progress");
    const HardProgressCircle = document.querySelector(".Hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const MediumLabel = document.getElementById("Medium-label");
    const HardLabel = document.getElementById("Hard-label");
    const cardStatsContainer = document.querySelector(".statscards");




    function validateUsername(username){
        if(username.trim() === ""){
            alert("username is empty");
            return false
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Username is Invalid")
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {

        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            //statsContainer.classList.add("hidden");

            // const response = await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);
            if(!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const fetchedData = await response.json();
            console.log("Logging data: ", fetchedData) ;

            displayUserData(fetchedData);
        }
        catch(error) {
            statscontainer.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }


    function displayUserData(fetchedData){
        const totalQuestions = fetchedData.data.allQuestionsCount[0].count;
        const totalEasyQuestions = fetchedData.data.allQuestionsCount[1].count ;
        const totalMediumQuestions = fetchedData.data.allQuestionsCount[2].count ;
        const totalHardQuestions = fetchedData.data.allQuestionsCount[3].count ;


        const solvedTotalQuestions = fetchedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQuestions = fetchedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQuestions = fetchedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalhardQuestions = fetchedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQuestions,totalEasyQuestions,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQuestions,totalMediumQuestions,MediumLabel,MediumProgressCircle);
        updateProgress(solvedTotalhardQuestions,totalHardQuestions,HardLabel,HardProgressCircle);
        
        const cardsData = [
            {label: "Overall Submissions", value: fetchedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            {label: "Overall Easy Submissions", value: fetchedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            {label: "Overall Medium Submissions", value: fetchedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            {label: "Overall Hard Submissions", value: fetchedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];
    
        console.log("card ka data: " , cardsData);

        console.log("card ka data: " , cardsData);

        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("")
    }


     




    searchButton.addEventListener('click', function(){
        const username = inputButton.value
        console.log("username details : username")
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})