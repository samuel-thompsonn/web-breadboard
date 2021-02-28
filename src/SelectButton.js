class SelectButton extends SquareButton {
	constructor(image,name,onClick) {
		super(image,name,onClick);
		this.onClick = function() {
			onClick();
			this.selected = true;
		}
	}
}