var storageRef = firebase.storage().ref("/Images/my-picture.png");
let inputImage = document.getElementById("input-add");
var fileData;
var db = firebase.firestore();
var imageList = []; 


inputImage.addEventListener('change', (e) => {
  fileData = e.target.files[0];
})

document.getElementById("upload-btn").addEventListener('click', (e) => {
  uploadImage();
  fileData = ""
})

var uploadImage = async () => {
  try {

    document.getElementById("loader").style.display = "block"

    let storageRef = firebase.storage().ref("/Images/" + parseInt(Math.random() * 10000000000));
    var data = await storageRef.put(fileData);
    let url = await data.ref.getDownloadURL()
    console.log(url)
    imageList.push(url);
    loadSingleImage(url);

    var data = {
      images: imageList
    }

    document.getElementById("loader").style.display = "none"
    inputImage.value = ""
    document.getElementById("input-label").style.display = "none"

    await UpdateDocument(data);

  } catch (error) {
    console.log(error)
    document.getElementById("loader").style.display = "none"
    document.getElementById("input-label").style.display = "block"
    setTimeout(() => {
      document.getElementById("input-label").style.display = "none"
    },3000);
  }
}


var UpdateDocument = async (data) => {
  try {
    var document = await db.collection("Images").doc("image-list").set(data, { merge: true });
  } catch (error) {
    console.error(error)
  }
}

var ReadDocumentByID = async () => {
  try {
    var document = await db.collection("Images").doc("image-list").get();
    return document.data()
  } catch (error) {
    console.error(error)
  }
}

function refreshUI() {
  var list = document.querySelector('.list');
  list.innerHTML = '';
  for (let i = 0; i < imageList.length; i++) {
    list.innerHTML += `<img class="image" src="${imageList[i]}">`;
  }
}

function loadSingleImage(url) {
  var list = document.querySelector('.list');
  let ele = document.createElement("img");
  ele.src = url;
  ele.classList.add("image")
  list.appendChild(ele);
}

Start();

async function Start() {
  var data = await ReadDocumentByID();
  imageList = data.images;
  refreshUI();
}