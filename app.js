const express = require('express');
var cors = require('cors');

const fs = require('fs');
const path = require('path')

const puppeteer = require('puppeteer');


const mecanicoimg =require('./model/mecanicoimg')
const maquinaslist =require('./model/maquinas')
 
const qr = require('qrcode');







 
 



const app = express();

//const mecanicoimg = require('./model/mecanicoimg');


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});
  /*
app.post("/upload-image", (req, res) => {
    const { text } = req.body;
  
    const project = {
        text
      
    };
  
    projects.push(project);
  
    return res.json(project);
  });













*/
//C:\Users\makys\Desktop\upload_back_end_nodejs\public\upload\users\1692375177447_IMG-20230808-WA0042.jpg

app.use('/imagem',express.static(path.resolve(__dirname,"public","upload")))

const uploadUser = require('./middlewares/uploadImage');



app.post("/upload-image", uploadUser.single('image'), async (req, res) => {
  

  try {
    // Verifica se o arquivo não passou pelo middleware do multer
    if (!req.file) {

       console.log("Erro: Nenhuma imagem recebida!")
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhuma imagem recebida!"
      });
    }

    // Se chegou aqui, significa que o arquivo foi processado pelo multer
     console.log("Upload realizado com sucesso!")
    return res.status(201).json({
      erro: false,
      mensagem: "Upload realizado com sucesso!"
    });
  } catch (error) {
    // Se houver um erro durante o processamento do arquivo

    console.log("Erro interno no servidor ao processar a imagem.")
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno no servidor ao processar a imagem."
    });
  }
});




app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));






app.post('/upload-imagebase64', (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhuma imagem recebida!"
    });
  }



  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const path = `./public/upload/users/${Date.now()}_image.png`;

  fs.writeFile(path, base64Data, 'base64', (err) => {
    if (err) {
      console.log("Erro interno no servidor ao processar a imagem.");
      return res.status(500).json({
        erro: true,
        mensagem: "Erro interno no servidor ao processar a imagem."
      });
    }

    console.log("Upload realizado com sucesso!");
    return res.status(201).json({
      erro: false,
      mensagem: "Upload realizado com sucesso!"
    });
  });
});
















const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Inicialize a autenticação
const serviceAccountAuth = new JWT({
  email: 'equipametomanute-ao@planilhaequipamentos.iam.gserviceaccount.com',
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIvlsG031CyU0G\nlAWaJIgTyErtye5iixi98rtQ6Pa6fIGM8SefD29Bl8SE/8LU1YpVJMTbvrEsKmnx\nUZ4sTzMcTbKSDkKUF6fUMM+FOyQPIjSkKX++JOegN7H9MVkqvMwIb+iWtH6/EYeu\ncW6ha5pJtLbS5iLpy/WR4lO8mVHzn1XRMP7LMC61smQ+v/miR0kUy558L1SBFsr7\nOfFM7k672+wvNBfrNG1YOp13oKv3LyVqrDi3zzuUuqCsLRjw8isGepNzykXRuYLH\nTewk5+QPtZGjM8IfL3P8Vpw1swO9PlnOx1F7JEtwxlDQRA4a4p/ZVpVOVN3OMdc9\nQ/rL6PbXAgMBAAECggEAE9dIrPCLUWYPEGbh9N3Ge1oRGdabEq9X1zJeFD2qYT08\nGr+dIGoIn42OFW0oBxxCC29Sa7u5zDk29myQOyXq0dHWI/x31SZPZrgaUrtJMZu6\nYz1czGDeaeYHWBSgEQrPCchxzy9w1Za4d+PrQNYfTkinx0mKytvnXi9mAl6PDIqW\nhw3LVsywQi4LOiFbOSgMUq1Ag8rJHb/PuSEVgnttqDTFFhvyww/A9mWn5Ekb0OJz\nghbHS+EcePIMSk1enkDNkF3A2jlFq/zqEr09jqgEWN52yGJEYCmqPkm9abfIE6DT\nVHgUsxXrxsatjbaLGh9ggms92obZkth7Q3UUnlKgXQKBgQD7KFLhGJSQbL4K/baY\n5vNbOLUBJKzd9L49q0x1HxUBBAECvo7FsiVDMEpkVkrC2gQMe02EdFGlH6jz3ZSp\nMC23iU3bMJ3HmWtryKbacaDB1t+IaPPt+o7Q3oyAmOPPT/kW7R5P45Nd4phIISAN\n0SYiK467fs4PUdObH6sjn4yNqwKBgQDMnTIzuifHWloKeyE8HVmZ7VYjQif7fzU4\nj5WkqoqXV13QpSYMK7ha3DXtcvKCnYsKNjNkqUgZ8Vz0OmdQhraqVoercEhXCz9J\nYOP1vjPd6etVBBBBIExciHBOp/dtC3qJrCbV9C4H8qoye3t4JmKdL3rkUA/c50V4\naG/fonsXhQKBgFr2p83O0T/dopbofRGz07/eMfBQECvzUFOVjwN8VmcfxB3yVlNT\nyhsjik380ubvfzfmEJVAa7GaXd61Cfqc8HHg0MnqObro3fcTnRrQvKB36k3FdVNj\nxAXyFIEe3qNfG6AqEShuDBmcz/qPxMQ8U8tcaz2NF6SExlcQiTNFveoxAoGAfJgg\nMLVjcZYIDCfMJhHtNLj74b5wIEnmu4lbYwjiGaP+oYVe9LxOpy0+vVdoarbKKq60\nftBB8mIx6xoBPVy6sGC+fluCAVb8847HYSWv6ap+Paeayj2DojkGwi6vkLwTou+s\nOk5VFUvj7ZeZqKEfHX4DBDHoZuiBOf/GV9RVxg0CgYEA2rp7QsLbD0GeMa4j4GFf\nOs6PzLSxxNAztS/QfjFY3L6Y3ay9PWug/giFwY50vK8Ybm1ix9QaRpVtTQj4DXS4\nN1WqK+HYt5pZ0iKb5OOyRsaHZlg2LRvF/S7O1pJlCKmHMH+GLeq8+BsDt+yXKyJT\nXh+hl00zR3OrDUuEUxl+M/A=\n-----END PRIVATE KEY-----\n",
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // Apenas permissão de leitura
});

const doc = new GoogleSpreadsheet('1dSRpfTH2su9B4xoGTiY-_ML5SKX4sba36mT5HIUIKQE', serviceAccountAuth);



app.get('/maquina/:id', async (req, res) => {
  const nomeDaMaquina = req.params.id;

  if (!nomeDaMaquina) {
    return res.status(400).send({
      error: 'Especifique o nome da máquina na consulta'
    });
  }

  try {
    const machineData = await getMachineData(nomeDaMaquina);

    if (machineData) {
      res.status(200).send(machineData);
    } else {
      res.status(404).send({ message: 'Máquina não encontrada' });
    }
  } catch (error) {
    console.error('Ocorreu um erro:', error);
    res.status(500).send({ error: 'Erro interno no servidor' });
  }
});

async function getMachineData(nomeDaMaquina) {
  try {
    const machine = await maquinaslist.findOne({ where: { nome: nomeDaMaquina } });

    if (!machine) {
      return null; // Retorna null se a máquina não for encontrada no banco de dados
    }

    return await findMachineData(nomeDaMaquina);
  } catch (error) {
    console.error('Erro ao buscar a máquina:', error);
    throw error;
  }
}

async function findMachineData(nomeDaMaquina) {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const columnIndex = 0;

    for (let i = 0; i < rows.length; i++) {
      const cellValue = rows[i]._rawData[columnIndex];

      if (cellValue === nomeDaMaquina) {
        // Retorna os dados da máquina como objeto
        return {
          nome: rows[i]._rawData[0],
          imageUrl: "/imagem/imagemequipamento/" + rows[i]._rawData[56],
          description: "",
          pdf: "/imagem/pdfequipamento/" + rows[i]._rawData[57],
          modelo: rows[i]._rawData[1],
          ULTIMA_TROCA_DATA: rows[i]._rawData[2],
          ULTIMA_TROCA_HORIM: rows[i]._rawData[3],
          DATA_ATUAL: rows[i]._rawData[4],
          HORI_ATUAL: rows[i]._rawData[5],
          HR_TRABA: rows[i]._rawData[6],
          INTERVALO: rows[i]._rawData[7],
          HR_REST: rows[i]._rawData[8],
         
          urlimagem: "/imagem/filtros/wm_s-removebg-preview.png",
          nomefiltro: "FILTRO AR INTERNO",
          horasrest: rows[i]._rawData[13],
          nomesol: rows[i]._rawData[14],
          nomereq: rows[i]._rawData[15],
          referencia: rows[i]._rawData[11],
          obs: rows[i]._rawData[16],
          dataultima: rows[i]._rawData[10],
          urlimagem1: "/imagem/filtros/wm_s-removebg-preview.png",
          nomefiltro1: "FILTRO AR EXTERNO",
          horasrest1: rows[i]._rawData[22],
          nomesol1: rows[i]._rawData[23],
          nomereq1: rows[i]._rawData[24],
          referencia1: rows[i]._rawData[20],
          obs1: rows[i]._rawData[25],
          dataultima1: rows[i]._rawData[19],
          urlimagem2: "/imagem/filtros/992493_filtro-oleo-motor-2vc115561-905411880013-tac1_z1_637042297440429857-removebg-preview.png",
          nomefiltro2: "LUBRIFICANTE",
          horasrest2: rows[i]._rawData[31],
          nomesol2: rows[i]._rawData[32],
          nomereq2: rows[i]._rawData[33],
          referencia2: rows[i]._rawData[29],
          obs2: rows[i]._rawData[34],
          dataultima2: rows[i]._rawData[28],
          urlimagem3: "/imagem/filtros/OIP-removebg-preview.png",
          nomefiltro3: "COMBUSTIVEL",
          horasrest3: rows[i]._rawData[40],
          nomesol3: rows[i]._rawData[41],
          nomereq3: rows[i]._rawData[42],
          referencia3: rows[i]._rawData[38],
          obs3: rows[i]._rawData[43],
          dataultima3: rows[i]._rawData[37],
          urlimagem4: "/imagem/filtros/Imagem13.png",
          nomefiltro4: "SEPARADOR D'AGUA",
          horasrest4: rows[i]._rawData[49],
          nomesol4: rows[i]._rawData[50],
          nomereq4: rows[i]._rawData[51],
          referencia4: rows[i]._rawData[47],
          obs4: rows[i]._rawData[52],
          dataultima4: rows[i]._rawData[46],
        };
      }
    }

    return null; // Retorna null se os dados não forem encontrados na planilha
  } catch (error) {
    console.error('Erro ao procurar a máquina:', error);
    throw error;
  }
}










   
app.get('/maquinas/:id', async (req, res) => {
  const machineId = req.params.id;

  try {
    // Busca a máquina pelo ID no banco de dados
    const machine = await mecanicoimg.findByPk(machineId);

    if (!machine) {
      return res.status(404).send('Máquina não encontrada');
    }

    // Se encontrou a máquina, retorna os detalhes em JSON
    res.json(machine);
  } catch (error) {
    console.error('Erro ao buscar máquina:', error);
    res.status(500).send('Erro interno ao buscar máquina');
  }
});























app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});