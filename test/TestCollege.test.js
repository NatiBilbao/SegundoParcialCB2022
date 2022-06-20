const TestCollege = artifacts.require("TestCollege");

contract("Testing college", accounts => {

    let instance;

    beforeEach("Deploy new contract", async () => {
        instance = await TestCollege.new();
    })

    it("Solo el profesor puede añadir una nueva revisión.", async () =>
    {
        try{
            await instance.createRevision([1, "Claudia", 0, false, 0],{from: accounts[0]});
            const note = await instance.listNotes.call(1);
            console.log(note.id);
            assert.equal(1, note.id);
        }catch (e) {
            console.log("Error", e);
            assert.equal("You are not the owner.", e.reason);
        }
    })

    it("Solo el profesor puede añadir una nueva revisión.", async () =>
    {
        try{
            await instance.finalizeReview(1,80,{from: accounts[0], value: web3.utils.toWei("1", "ether")});
            const note = await instance.listNotes.call(1);

            assert.equal(note.finalized, true);
            assert.equal(note.typeTest, 1);
            assert.equal(note.score, 80);
        }catch (e) {
            console.log("Error", e);
            assert.equal("You are not the owner.", e.reason);
        }
    })

    it("Solo el profesor puede añadir una nueva revisión.", async () =>
    {
        try{
            await instance.closeOrOpenRevisions(true, {from: accounts[0]});
            const flag = await instance.getRevisionsClosed.call();
            assert.equal(flag, true);
        }catch (e) {
            console.log("Error", e);
            assert.equal("You are not the owner.", e.reason);
        }
    })

    it("Verifique que el estudiante obtenga 100 debido al redondeo", async () =>
    {
        await instance.createRevision([2, "Tadeo", 0, false, 0],{from: accounts[0]});
        await instance.finalizeReview(2,91,{from: accounts[0], value: web3.utils.toWei("1", "ether")});
        const note = await instance.listNotes.call(2);
        console.log(note.score);
        assert.equal(100, note.score);
    })


    it("Verifique que la longitud del nombre del estudiante sea superior a 5", async () =>
    {
        try {
            await instance.createRevision([3, "Cris", 0, false, 0],{from: accounts[0]});

            const note = await instance.listNotes.call(3);
            console.log(note.name);
            assert(note.name.length > 5);
        } catch (e) {
            console.log("Error", e);
            assert.equal("El nombre del producto debe ser más que.", e.reason);
        }

    })

    it("Verifique que el estudiante obtenga 100", async () =>
    {
        await instance.createRevision([4, "Lili", 0, false, 0],{from: accounts[0]});
        await instance.finalizeReview(4,100,{from: accounts[0], value: web3.utils.toWei("1", "ether")});
        const note = await instance.listNotes.call(4);
        console.log(note.score);
        assert.equal(100, note.score);
    })

    it("Verificar que el alumno tenga su puntaje finalizado y que pague 10 ETH", async () =>
    {

        await instance.createRevision([5, "Tatiana", 0, false, 0],{from: accounts[0]});
        await instance.finalizeReview(5,30,{from: accounts[0], value: web3.utils.toWei("1", "ether")});
        const note = await instance.listNotes.call(5);
        console.log("Que no pro");
        console.log(note.finalized);
        console.log(note.typeTest.negative);
        console.log("Hola")
        assert.equal(note.finalized, true);
        assert.equal(note.typeTest.negative, 1);

        const price = "11";
        const iBalance = accounts[5].balance;
        await instance.request2T(5,{from: accounts[0], value: web3.utils.toWei(price, "ether")});
        const fBalance = accounts[5].balance;
        assert.equal(note.finalized, false);
        assert.equal(note.typeTest, 2);
        const diff = iBalance - fBalance
        assert(10 <= diff);

        console.log(diff);


    })

    it("Solo el profesor puede verificar el saldo", async () =>
    {
        try {
            await instance.balanceOfCollege({from: accounts[2]});

        } catch (e) {
            console.log("Error", e);
            assert.equal("You are not the owner.", e.reason);
        }

    })


})