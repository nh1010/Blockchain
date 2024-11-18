const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, citationData, precedingHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.citationData = {
            author: citationData.author || '',
            paper: citationData.paper || '',
            citedBy: citationData.citedBy || '',
            rewardPoints: citationData.rewardPoints || 0,
            citationType: citationData.citationType || 'standard'
        };
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    computeHash() {
        return SHA256(
            this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.citationData) +
            this.nonce
        ).toString();
    }

    proofOfWork(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
}

class CitationChain {
    constructor() {
        this.blockchain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2024", {
            author: "System",
            paper: "Genesis Citation",
            citedBy: "System",
            rewardPoints: 0,
            citationType: "genesis"
        }, "0");
    }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }

    checkChainValidity() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            if (currentBlock.precedingHash !== precedingBlock.hash) {
                return false;
            }
        }
        return true;
    }

    addCitation(author, paper, citedBy, rewardPoints, citationType) {
        const newBlock = new Block(this.blockchain.length, new Date().toISOString(), {
            author,
            paper,
            citedBy,
            rewardPoints,
            citationType
        });
        this.addNewBlock(newBlock);
        return newBlock;
    }

    getCitationsByAuthor(author) {
        return this.blockchain.filter(block => 
            block.citationData.author === author || 
            block.citationData.citedBy === author
        );
    }

    getTotalRewardPoints(author) {
        return this.blockchain.reduce((total, block) => {
            if (block.citationData.author === author) {
                return total + block.citationData.rewardPoints;
            }
            return total;
        }, 0);
    }
}

// Example usage
let citationChain = new CitationChain();
console.log("Citation Chain initialization in progress....");

citationChain.addCitation(
    "John Doe",
    "Blockchain Applications",
    "Jane Smith",
    10,
    "research"
);

citationChain.addCitation(
    "Jane Smith",
    "Distributed Systems",
    "Alice Johnson",
    15,
    "review"
);

console.log(JSON.stringify(citationChain, null, 2));
console.log("John Doe's total rewards:", citationChain.getTotalRewardPoints("John Doe"));