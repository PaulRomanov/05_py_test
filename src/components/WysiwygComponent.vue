<template>
  <div class="editor-container">
    <div class="toolbar">
      <button @click="undo" class="icon-button">
        <img :src="icons.undo" alt="Undo Icon" />
      </button>
      <button @click="redo" class="icon-button">
        <img :src="icons.redo" alt="Redo Icon" />
      </button>
      <button @click="makeHeader" class="icon-button">
        <img :src="icons.header" alt="Header Icon" />
      </button>
      <button @click="makeParagraph" class="icon-button">
        <img :src="icons.paragraph" alt="Paragraph Icon" />
      </button>
      <button @click="insertImage" class="icon-button">
        <img :src="icons.image" alt="Image Icon" />
      </button>
      <button @click="copyHTML" class="copy-button">Скопировать HTML</button>
    </div>
    <div contenteditable="true" ref="editor" @input="updateEditorContent">
      <p>
        Таким образом консультация с широким активом представляет собой интересный
        эксперимент проверки позиций, занимаемых участниками в отношении поставленных
        задач. С другой стороны постоянное информационно-пропагандистское обеспечение
        нашей деятельности представляет собой интересный эксперимент проверки форм
        развития. Идейные соображения высшего порядка, а также укрепление и развитие
        структуры влечет за собой процесс внедрения и модернизации соответствующий условий
        активизации. Задача организации, в особенности же реализация намеченных плановых
        заданий играет важную роль в формировании дальнейших направлений развития.
        Повседневная практика показывает, что постоянное информационно-пропагандистское
        обеспечение нашей деятельности играет важную роль в формировании существенных
        финансовых и административных условий.
      </p>
      <h2>Смотрите какие обезьянки</h2>
      <img src="@/assets/image1.png" alt="Изображение" />
      <p>
        Таким образом консультация с широким активом представляет собой интересный
        эксперимент проверки позиций, занимаемых участниками в отношении поставленных
        задач. С другой стороны постоянное информационно-пропагандистское обеспечение
        нашей деятельности представляет собой интересный эксперимент проверки форм
        развития. Идейные соображения высшего порядка, а также укрепление и развитие
        структуры влечет за собой процесс внедрения и модернизации соответствующий условий
        активизации. Задача организации, в особенности же реализация намеченных плановых
        заданий играет важную роль в формировании дальнейших направлений развития.
        Повседневная практика показывает, что постоянное информационно-пропагандистское
        обеспечение нашей деятельности играет важную роль в формировании существенных
        финансовых и административных условий.
      </p>

      <p>
        Товарищи! новая модель организационной деятельности требуют от нас анализа
        направлений прогрессивного развития. Задача организации, в особенности же
        постоянный количественный рост и сфера нашей активности требуют от нас анализа
        позиций, занимаемых участниками в отношении поставленных задач. Задача
        организации, в особенности же реализация намеченных плановых заданий требуют от
        нас анализа системы обучения кадров, соответствует насущным потребностям.
      </p>
    </div>
  </div>
</template>

<script>
import undoIcon from "@icons/undo.svg";
import redoIcon from "@icons/redo.svg";
import headerIcon from "@icons/header.svg";
import paragraphIcon from "@icons/paragraph.svg";
import imageIcon from "@icons/image.svg";

export default {
  name: "WysiwygComponent",
  data() {
    return {
      editorContent: "", // Исходное содержимое
      undoStack: [],     // Стек отмены
      redoStack: [],     // Стек повтора
      icons: {
        undo: undoIcon,
        redo: redoIcon,
        header: headerIcon,
        paragraph: paragraphIcon,
        image: imageIcon,
      },
    };
  },

  methods: {
    updateEditorContent(event) {
      const newContent = event.target.innerHTML;
      // Сохраняем текущее состояние в стеке отмены, но ограничиваем его длину, чтобы не сохранять слишком много состояний.
      this.undoStack.push(this.editorContent);
      if (this.undoStack.length > 20) {
        this.undoStack.shift(); // Удаляем старое состояние
      }
      this.editorContent = newContent;
      // При каждом вводе очищаем стек повтора, так как новое действие отменяет предыдущие действия повтора.
      this.redoStack = [];
    },
    undo() {
      if (this.undoStack.length > 0) {
        const previousContent = this.undoStack.pop();
        this.redoStack.push(this.editorContent); // Передвигаем текущее состояние в стек повтора
        this.editorContent = previousContent;
      }
    },
    redo() {
      if (this.redoStack.length > 0) {
        const nextContent = this.redoStack.pop();
        this.undoStack.push(this.editorContent); // Передвигаем текущее состояние в стек отмены
        this.editorContent = nextContent;
      }
    },
  
    makeHeader() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const header = document.createElement("h2");
        range.surroundContents(header);
      }
    },
    makeParagraph() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let commonAncestor = range.commonAncestorContainer;
        let header = null;

        while (commonAncestor) {
          if (commonAncestor.nodeName === "H2") {
            header = commonAncestor;
            break;
          }
          commonAncestor = commonAncestor.parentNode;
        }

        if (header) {
          const paragraph = document.createElement("p");
          paragraph.classList.add("custom-paragraph");
          paragraph.innerHTML = header.innerHTML;
          header.parentNode.replaceChild(paragraph, header);
        }
      }
    },
    insertImage() {
      const imageUrl = prompt("Введите URL картинки:");
      if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Изображение";
        this.$refs.editor.appendChild(img);
      }
    },
    copyHTML() {
      const editor = this.$refs.editor;
      const editorContent = editor.innerHTML;

      navigator.clipboard
        .writeText(editorContent)
        .then(() => {
          alert("HTML скопирован в буфер обмена.");
        })
        .catch((error) => {
          console.error("Ошибка копирования HTML в буфер обмена:", error);
        });
    },
  
  },
};
</script>
<style scoped>
.editor-container {
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 0 100px;
}

.toolbar {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.icon-button {
  background-color: #000;
  border: none;
  cursor: pointer;
  transition: border-color 0.3s;
}

.icon-button img:hover,
.copy-button:hover {
  border: 2px solid #639eff;
}

.icon-button img {
  width: 50px;
  height: 50px;
  border: 2px solid transparent;
}

.copy-button:active {
  background-color: #639eff;
  color: #fff;
}
.icon-button:active img {
  filter: brightness(0.7);
}
.copy-button {
  background-color: #000;
  color: #639eff;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  border: 2px solid transparent;
}
p {
  margin: 0;
  padding: 0;
}
.custom-paragraph {
  margin: 0;
  padding: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}
</style>
