import urllib, uuid, logging, time
from youtube_dl import YoutubeDL
from flask import Flask, send_file, redirect, request

app = Flask(__name__)
mainLog = logging.getLogger("main_log")
mainLog.setLevel(logging.INFO)
streamHandler = logging.StreamHandler()
streamHandler.setFormatter(logging.Formatter('[%(asctime)s] %(name)s:%(levelname)s:%(message)s'))
mainLog.addHandler(streamHandler)
mainLog.info('mainLog loaded')


@app.route('/mp3/<video_id>', methods=['GET'])
def download(video_id):
    try:
        log = logging.getLogger("main_log")
        log.info(getIp() + ' - get download request for ' + video_id)
        unique_filename = 'download/' + str(uuid.uuid4()) + '-' + str(int(time.time()))
        dl_opt = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192'
            }],
            'outtmpl': unique_filename + '.%(ext)s',
            'max_filesize': 26214400
        }

        yt = YoutubeDL(dl_opt)
        url = 'https://www.youtube.com/watch?v=' + video_id
        yt.download([url])
        log.info(getIp() + ' - send mp3 for ' + video_id)
        return send_file(unique_filename + '.mp3', as_attachment=True)
    except Exception as e:
        log.error(getIp() + ' - ' + str(e))
        return '', 403


@app.route('/')
def goToStore():
    logging.getLogger("main_log").info(getIp() + ' - redirect to chrome webstore')
    return redirect('https://chrome.google.com/webstore/detail/youtube-mp3-right-click-t/ggimihiadbdmmblihmnlojlpfppkdonk', code=302)


def getIp():
    try: return request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    except: return '0.0.0.0'


if __name__ == '__main__':
    app.run('0.0.0.0', 80, debug=False, threaded=True)
