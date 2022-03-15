function polling() {
  setTimeout(polling, 1000 * 30);
}

polling();
