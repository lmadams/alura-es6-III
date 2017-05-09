class NegociacaoDao {

    constructor(conn) {
        this._connection = conn;
        this._store = 'negociacoes';
    }

    adiciona(negociacao) {
        return new Promise((resolve, reject) => {
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .add(negociacao);

            request.onsuccess = e => {
                resolve();
            };

            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possovel adicionar a negociacao!');
            }

        });
    }

    listaTodos(){
        return new Promise((resolve, reject) => {
            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore('negociacoes')
                .openCursor();
            let negociacoes = [];

            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    let dado = atual.value;

                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                    atual.continue();
                } else {
                    resolve(negociacoes);
                }
            };

            cursor.onerror = e => {
                console.log(e.target.error);
                reject('Erro ao recuperar todas as negociacoes!')
            }
        })
    }

    apagaTodos() {
        return new Promise((resolve, reject) => {
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore('negociacoes')
                .clear();

            request.onsuccess = e => {
                resolve('Negociações removidas com sucessso!');
            };

            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possivel remover as negociacoes!')
            }
        });
    }
}
