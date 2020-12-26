const jq = $.noConflict();
jq(document).ready(() => {
    let match = jq(document).find('li.selected').attr('id')
    const typeSelect = jq('.nav-item');
    const inputField = jq('#input-field');
    const searchBtn = jq('#search');
    const result = jq('.result-list')
    const noWord = jq('.no-word');
    let wordSort = 'a-z'
    const wordList = [];
    const url = 'https://api.datamuse.com/words?';
    const metadata = '&md=d'

    // Function with navbar
    typeSelect.on('click',function(e) {
        typeSelect.removeClass('selected')
        jq(this).addClass('selected')
        match = jq(document).find('li.selected').attr('id')
        displayResult(e)
        // console.log(match)
    });
    const mobileTypeSelect = jq('.nav-mobile-list');
    mobileTypeSelect.on('change', function(e) {
        e.preventDefault();
        match = jq("select option:selected").attr('value');
        displayResult(e)
        // console.log(match)
    })
    // Function to choose sort word
    jq('#sort').on('change', function(e) {
        e.preventDefault();
        wordSort = jq("#sort option:selected").val()
    })
    
    // Render result
    const renderResponse = (res) => {
        const numberWord = document.getElementById('word-number')
        // console.log(numberWord)
        if(!res) {
            console.log(res.status)
        }
        if (!res.length) {
            noWord.css({"display": "block"}).html('<em><strong>*Không tìm thấy kết quả phù hợp</strong></em>')
            return;
        }
        // // Sort array
        // const compare = (a,b) => {
        //     if (a.word < b.word) {
        //         return -1
        //     }
        //     else if (a.word > b.word) {
        //         return 1
        //     }
        //     else {return 0}
        // }
        // res.sort(compare);
        // console.log(res)
        // 
        let min = Math.min(10, res.length);
        if(wordList.length) {
            wordList.length = 0;
        }
        for (let i = 0; i < min; i++) {
        
            wordList.push(
                `
                <li>
                <p><strong>${res[i].word}</strong></p>
                <br>
                <span>
                    
                    <em>${res[i].defs}.</em>
                </span>
                </li>
                `
            )
        }
        // console.log(wordList)
        // if(wordSort === 'a-z') {
        //     wordList.sort((a,b) => a.word-b.word);
        // }
        // else {
        //     wordList.sort((a,b) => b.word-a.word);
        // }
        // console.log(wordList)
        for (let i = 0; i < min; i++) {
            result.append(wordList[i])
            // console.log(wordList[i])
        }
    }

    // Spinner
    const spinner = jq('.loader');
    const showSpinner = () => {
        spinner.show()
        setTimeout(() => {
            spinner.hide()
        },800)
    }

    // Fetch to Get API
    const getApi = async () => {
        const wordQuery = inputField.val()
        const endpoint = `${url}${match}=${wordQuery}${metadata}`;
        console.log(endpoint)
        try {
            const res = await fetch(endpoint,{cache:'no-cache'})
            if(res.ok) {
                const jsonRes = await res.json();
                renderResponse(jsonRes)
            }
        }
        catch(error) {
            console.log(error)
        }
    }
    const displayResult = (e) => {
        e.preventDefault();
        result.empty();
        noWord.empty();
        jq('.result-title').css({'display': "block"})
        showSpinner()
        getApi()
    }
    searchBtn.on('click', displayResult);
    inputField.on('keypress', function(e) {
        // e.preventDefault();
        if(e.which == 13) {
            displayResult(e)
        }
    })
})
