import { Router, Response,  Request, NextFunction } from 'express'
import { start } from 'repl'
import WebTorrent, {Torrent, TorrentFile} from 'webtorrent'

const router = Router()
const  client = new WebTorrent()

let state = {
    progress: 0,
    downloadSpeed: 0,
    ratio: 0


}

let error;

client.on('error', (err: Error ) => {
    console.error('err', err.message)
    error = err.message
   })

client.on('torrent', () => { 
    console.log(client.progress)
    state = {  
        progress: Math.round(client.progress * 100 * 100) / 100,
        downloadSpeed: client.downloadSpeed,
        ratio: client.ratio
     }
})

router.get('/add/:magnet', (req: Request, res: Response) => {
    const magnet = req.params.magnet

    client.add(magnet, torrent=>{
        const files = torrent.files.map(data => ({
            name: data.name,
            length: data.lenght
        }))
        res.status(200).send(files)
    })
})

router.get('/stats', (req: Request, res: Response) => {
    state = {  
        progress: Math.round(client.progress * 100 * 100) / 100,
        downloadSpeed: client.downloadSpeed,
        ratio: client.ratio
     }
    res.status(200).jsend(state)
 })


 //stream
 interface Streamrequest extends Request {
    params: {
        magnet: string;
        fileName: string;
    }
    headers: {
        range: string;

    }
 }
 interface ErrorWithStatus extends Error {
    status: number
}
 router.get('stream/:magnet/:fileName', 
    (req: Streamrequest, res: Response, next: NextFunction)=>{
       const {
        params: {magnet , fileName},
        headers: {range}
       }  = req
     

       if (!range) {
        const error = new Error('Wrong range')
        error.statusCode = 416
        return next(error)
       }
    const torrentFile = client.get(magnet) as Torrent
    let file = <TorrentFile>{}

    for(let i = 0; i < torrentFile.files.length; i++){
        const currentTorrentPiece = torrentFile.files[i]
        if(currentTorrentPiece.name === fileName){
            file = currentTorrentPiece
            break
        }
    }
    'bytes=0-123'
    const fileSize = file.length

    const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-')  

    const start = Number(startParsed)
    const end = endParsed ? Number(endParsed) : fileSize - 1

    const chunkSize = end - start + 1

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
    }

    res

 })


 export default router