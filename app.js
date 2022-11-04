const mysql = require ('mysql')
const express = require ('express');
const app = express();
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

app.use(express.static("public"))

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database : "siperumahan",
    password: ""
  });
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.get("/dashboard", (req,res)=>{
  connection.query("select * from penghuni", (err,length)=>{
    if (err) throw err;
    res.render('dashboard.ejs', {penghuni: length})
  })
})

app.get("/halaman-utama", (req,res)=>{
  connection.query(`select * from berita`,(err,rows)=>{
    if (err) throw err;
    res.render("beranda.ejs",{berita: rows})
  })
})

//login admin
app.get('/login-admin',(req,res)=>{
    res.render('loginadmin.ejs');
  })
  
  app.post("/login-admin",encoder,(req,res)=>{
    const username = req.body.adminusername;
    const password = req.body.adminpassword;
    
    connection.query("select * from admin_account where admin_username = ? and admin_password = ?",[username,password],(error,results,fields)=>{
      if(results.length > 0){
        res.redirect("/dashboard");
      } else {
        res.redirect("/login-admin")
      }
      res.end();
    })
  })

//loginuser
app.get('/',(req,res)=>{
  res.render('loginuser.ejs');
})

app.post("/",encoder,(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  
  connection.query("select * from penghuni where username = ? and password = ?",[username,password],(error,results,fields)=>{
    if(results.length > 0){
      res.redirect("/halaman-utama");
    } else {
      res.redirect("/")
    }
    res.end();
  })
})

//transaksi
app.get('/tagihan', (req,res)=>{
  res.render("tagihan.ejs")
})

app.get('/transaksi',(req,res)=>{
  res.render("transaksi.ejs");
})

//penghuni
app.get('/penghuni', (req,res)=>{
  connection.query('select * from penghuni', (err,rows)=>{
    if (err) throw err;
    res.render("pnghn.ejs",{penghuni: rows});
  })
})

app.get('/tambah-penghuni', (req,res)=>{
  res.render("tpeng.ejs")
})

app.post('/tambah-list-penghuni',encoder, (req,res)=>{
    let nama = req.body.nama_penghuni
    let telp = req.body.no_telp
    let rumah = req.body.no_rumah
    let username = req.body.username
    let password = req.body.password

    console.log(nama)
    connection.query(`INSERT INTO penghuni(nama,no_telp,no_rumah,username,password) VALUES ('${nama}','${telp}','${rumah}','${username}','${password}')`, (err,results)=>{
        if(err) throw err;
        res.redirect("/penghuni")
    })
})

//berita
app.get('/berita',(req,res)=>{
    connection.query('select * from berita',(err,rows)=>{
      if (err) throw err;
      res.render("berita.ejs",{berita: rows});
    })
  })
  
  app.get('/tambah-berita',(req,res)=>{
    res.render("bberita.ejs");
  })
  
app.post('/upload-berita',encoder, (req,res)=>{
   let data = {judul_berita: req.body.judul_berita, isi_berita: req.body.isi_berita};
   let sql = "INSERT INTO berita SET ?";
   let query = connection.query(sql,data,(err,results)=>{
        if (err) throw err;
        res.redirect('/berita')
   })
  })

app.get('/edit-berita/:id_berita',(req,res)=>{
  let id = req.params.id_berita;
  let sql = `select * from berita where id_berita='${id}'`;
  let query = connection.query(sql,(err,results)=>{
    if (err) throw err;
    res.render("update.ejs",{berita: results[0]})
  })
})

app.post('/update-berita',encoder, (req,res)=>{
  let data = {judul_berita: req.body.judul_berita, isi_berita: req.body.isi_berita};
  let sql = "update berita set ?";
  let query = connection.query(sql,data,(err, results)=>{
    if (err) throw err;
    res.redirect('/berita')
  })
})

app.get("/hapus/:id_berita",(req,res)=>{
    connection.query(`delete from berita where id_berita ='${req.params.id_berita}'`,(req,rows)=>{
        res.redirect("/berita");
    })
})

app.listen(3000, ()=>{
    console.log ('Server berjalan di port 3000')
})
