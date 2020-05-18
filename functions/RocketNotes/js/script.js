document.execCommand('defaultParagraphSeparator', false, 'div');

var app = new Vue({
    el: '#app',
    data: {
        remsize: parseFloat(getComputedStyle(document.documentElement).fontSize),
        showNotes: true,
        notes: JSON.parse(window.localStorage.getItem('notes')) || [],
        currentNoteIndex: null,
        currentNote: null,
        selectedNodeIndex: null,
        paperWidth: 0,
        noteFilter: ''
    },
    methods: {
        saveFilter: function(e){
            this.noteFilter = e.currentTarget.value.toLowerCase();
        },
        checkToDisplay: function(note){
            var title = note.title.toLowerCase();
            for (var i = 0; i < this.noteFilter.length; i++) {
                if (this.noteFilter[i] !== title[i]) {
                    return false;
                }
            }
            return true;
        },
        copy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        getTimeStr: function() {
            return new Date().toISOString().replace('T', ' ').split('.', 1)[0];
        },
        toggleView: function () {
            if (this.showNotes === true) {
                this.showNotes = false;
            } else {
                this.showNotes = true;
            }
            this.$nextTick(this.onResize);
        },
        newNote: function() {
            this.notes.unshift({
                title: 'New Note',
                content: [],
                lastEdited: this.getTimeStr()
            });
            this.currentNoteIndex = 0;
            this.currentNote = this.copy(this.notes[0]);
            this.selectedNodeIndex = null;
            this.saveNotes();
        },
        changeTextAlign: function (e) {
            if (this.selectedNodeIndex === null) {
                return;
            }
            if (this.currentNote.content[this.selectedNodeIndex].textAlign === undefined) {
                return;
            }
            var nodes = e.currentTarget.parentElement.children;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] === e.currentTarget) {
                    if (i === 0) {
                        this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].textAlign = 'left';
                        this.currentNote.content[this.selectedNodeIndex].textAlign = 'left';
                        this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                        this.saveNotes();
                        return;
                    } else if (i === 1) {
                        this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].textAlign = 'center';
                        this.currentNote.content[this.selectedNodeIndex].textAlign = 'center';
                        this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                        this.saveNotes();
                        return;
                    } else if (i === 2) {
                        this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].textAlign = 'right';
                        this.currentNote.content[this.selectedNodeIndex].textAlign = 'right';
                        this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                        this.saveNotes();
                        return;
                    }
                }
            }
        },
        displayNote: function (note, index) {
            this.currentNoteIndex = index;
            this.currentNote = this.copy(note);
            this.selectedNodeIndex = null;
            this.$nextTick(this.onResize);
        },
        saveNotes: function() {
            if (this.currentNoteIndex !== 0 && this.currentNoteIndex !== null) {
                this.notes.unshift(this.notes[this.currentNoteIndex]);
                this.notes.splice(this.currentNoteIndex+1, 1);
                this.currentNoteIndex = 0;
            }
            localStorage.setItem('notes', JSON.stringify(this.notes));
        },
        textChange: function (e) {
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data = e.currentTarget.innerHTML;
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.saveNotes();
        },
        titleChange: function (e) {
            this.notes[this.currentNoteIndex].title = e.currentTarget.innerText;
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.saveNotes();
        },
        selectNode: function(index) {
            this.selectedNodeIndex = index;
        },
        newUnorderedListElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'unordered list',
                data: ['']
            });
            this.currentNote.content = this.copy(this.notes[this.currentNoteIndex].content);
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        newOrderedListElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'ordered list',
                data: ['']
            });
            this.currentNote.content = this.copy(this.notes[this.currentNoteIndex].content);
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        newImageElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'image',
                data: [],
                textAlign: 'left'
            });
            this.currentNote.content = this.copy(this.notes[this.currentNoteIndex].content);
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        newChecklistElement: function(){
            this.notes[this.currentNoteIndex].content.push({
                type: 'checklist',
                data: [{text: '', checked: 'unchecked'}]
            });
            this.currentNote.content = this.copy(this.notes[this.currentNoteIndex].content);
            this.saveNotes();
        },
        newTextElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'text',
                data: '',
                textAlign: 'left'
            });
            this.currentNote.content = this.copy(this.notes[this.currentNoteIndex].content);
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        deleteBlock: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.splice(this.selectedNodeIndex, 1);
            this.currentNote = this.copy(this.notes[this.currentNoteIndex]);
            this.selectedNodeIndex = null;
            this.saveNotes();
        },
        upBlock: function(){
            if (this.selectedNodeIndex === 0) {
                return;
            }
            var temp = this.copy(this.notes[this.currentNoteIndex].content[this.selectedNodeIndex]);
            temp.lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex] = this.notes[this.currentNoteIndex].content[this.selectedNodeIndex-1];
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex-1] = temp;
            this.selectedNodeIndex--;
            this.currentNote = this.copy(this.notes[this.currentNoteIndex]);
            this.saveNotes();
        },
        downBlock: function(){
            if (this.selectedNodeIndex === this.notes[this.currentNoteIndex].content.length-1) {
                return;
            }
            var temp = this.copy(this.notes[this.currentNoteIndex].content[this.selectedNodeIndex]);
            temp.lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex] = this.notes[this.currentNoteIndex].content[this.selectedNodeIndex+1];
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex+1] = temp;
            this.selectedNodeIndex++;
            this.currentNote = this.copy(this.notes[this.currentNoteIndex]);
            this.saveNotes();
        },
        deleteNote: function(index){
            this.notes.splice(index, 1);
            this.currentNoteIndex = null;
            this.currentNote = null;
            this.selectedNodeIndex = null;
            this.saveNotes();
        },
        copyNote: function(index){
            var copyObject = this.copy(this.notes[index]);
            copyObject.lastEdited = this.getTimeStr();
            this.notes.unshift(copyObject);
            this.currentNote = this.copy(copyObject);
            this.currentNoteIndex = 0;
        },
        addImage: function(){
            var parent = this;
            var addToNote = this.currentNoteIndex;
            var addToElement = this.selectedNodeIndex;

            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.addEventListener('input', function(){
                var file = this.files[0];
                var image = new Image();
                image.addEventListener('load', function(){
                    /* file is a valid image source */
                    var reader = new FileReader();

                    reader.onload = function(){
                        if (parent.notes[addToNote] === undefined || parent.notes[addToNote].content[addToElement] === undefined || parent.notes[addToNote].content[addToElement].type !== 'image') {
                            return;
                        }
            
                        parent.notes[addToNote].lastEdited = app.getTimeStr();
                        parent.notes[addToNote].content[addToElement].data.push({
                            src: this.result,
                            width: 0.3
                        });
                        if (addToNote === parent.currentNoteIndex) {
                            parent.currentNote.content = parent.copy(parent.notes[addToNote].content);
                        }
                    }

                    reader.readAsDataURL(file);
                });
                image.src = URL.createObjectURL(file);
            });
            fileInput.click();
        },
        zoomOutImage: function(index){
            var width = Math.floor((this.currentNote.content[this.selectedNodeIndex].data[index].width - 0.05)*100)/100;
            if (width > 0) {
                this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index].width = width;
                this.currentNote.content[this.selectedNodeIndex].data[index].width = width;
                this.saveNotes();
            }
        },
        zoomInImage: function(index){
            var width = Math.floor((this.currentNote.content[this.selectedNodeIndex].data[index].width + 0.05)*100)/100;
            if (width <= 1) {
                this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index].width = width;
                this.currentNote.content[this.selectedNodeIndex].data[index].width = width;
                this.saveNotes();
            }
        },
        deleteImage: function(index){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.splice(index, 1);
            this.currentNote.content[this.selectedNodeIndex].data.splice(index, 1);
            this.saveNotes();
        },
        addListItem: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.push('');
            this.currentNote.content = this.copy(this.notes[this.currentNoteIndex].content);
            this.saveNotes();
        },
        deleteListItem: function(){
            if (this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.length < 2) {
                return;
            }
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.pop();
            this.currentNote.content[this.selectedNodeIndex].data = this.copy(this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data);
            this.saveNotes();
        },
        saveListText: function(e, index){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index] = e.currentTarget.innerHTML;
            this.saveNotes();
        },
        addChecklistItem: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.push({
                text: '',
                checked: 'unchecked'
            });
            this.currentNote.content[this.selectedNodeIndex].data = this.copy(this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data);
            this.saveNotes();
        },
        checkItem: function(nodeIndex, checkIndex){
            if (this.notes[this.currentNoteIndex].content[nodeIndex].data[checkIndex].checked === 'unchecked') {
                this.notes[this.currentNoteIndex].content[nodeIndex].data[checkIndex].checked = 'checked';
            } else {
                this.notes[this.currentNoteIndex].content[nodeIndex].data[checkIndex].checked = 'unchecked';
            }
            this.currentNote.content[nodeIndex].data = this.copy(this.notes[this.currentNoteIndex].content[nodeIndex].data);
            this.saveNotes();
        },
        saveChecklistText: function(e, index){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index].text = e.currentTarget.innerHTML;
            this.saveNotes();
        },
        moveBack: function(){
            this.currentNoteIndex = null;
            this.currentNote = null;
        },
        onResize: function(){
            var paper = document.querySelector('#content');
            if (paper === null) {
                return;
            }
            this.paperWidth = paper.offsetWidth - (2 * this.remsize);
        }
    },
    mounted: function(){
        window.addEventListener('resize', this.onResize);
    }
});