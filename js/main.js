$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    center: true,
    items: 2,
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      600: {
        items: 4,
      },
    },
  });

  $(".minus").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    var id = $this.closest("div").find(".id_data").val();
    var name = $this.closest("div").find("h3");
    var total = $this.closest("div").find("input[name='name']");
    var price = $this.closest("div").find("p").data("price");

    var value = parseInt(total.val());

    total.val((value -= 1));

    data = {
      id: id,
      name: name.html(),
      total: value,
      price: price,
    };

    if (value == 0) {
      $this.hide();
      total.hide();

      hapusPesanan(data);
    } else {
      ubahPesanan(data);
    }

    loadPesanan();
  });

  $(".plus").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    var minus = $this.closest("div").find(".minus");

    var id = $this.closest("div").find(".id_data").val();
    var name = $this.closest("div").find("h3");
    var total = $this.closest("div").find("input[name='name']");
    var price = $this.closest("div").find("p").data("price");

    var value = parseInt(total.val());

    $(total).val((value += 1));

    data = {
      id: id,
      name: name.html(),
      total: value,
      price: price,
    };

    if (value != 0) {
      name.fadeIn();
      total.fadeIn();
      minus.fadeIn();
    }
    ubahPesanan(data);
    loadPesanan();
  });

  $("#buttonPesan").on("click", function () {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient();
    } else {
      if (localStorage.list_data) {
        list_data = JSON.parse(localStorage.getItem("list_data"));

        message = "";
        var total_pembayaran = 0;
        for (i in list_data) {
          var int_price = parseInt(list_data[i].price);
          var int_total = parseInt(list_data[i].total);
          var pembayaran = int_price * int_total;

          total_pembayaran += pembayaran;

          message += `*${list_data[i].total} ${list_data[i].name}`;
        }
        liff
          .sendMessages([
            {
              type: "text",
              text: `
              Hai Customer, 
              Terimakasih telah memesan di Nito Resto, Berikut adalah review pesananya :
              ${message}
              `,
            },
          ])
          .then(() => {
            alert("Pesanan telah diterima. Harap tunggu");
          })
          .catch((error) => {
            alert("Aduh kok error ya...");
          });
      }
    }
  });
});

function loadPesanan() {
  if (localStorage.list_data) {
    list_data = JSON.parse(localStorage.getItem("list_data"));

    var data_app = "";

    if (list_data.length > 0) {
      data_app = '<h3>List Pesanan :</h3><table class="table table-striped">';

      data_app +=
        `<thead>` +
        `<th>Jumlah</th>` +
        `<th>Menu</th>` +
        `<th>Total Harga</th>` +
        `</thead> <tbody>`;

      var total_pembayaran = 0;
      for (i in list_data) {
        var int_price = parseInt(list_data[i].price);
        var int_total = parseInt(list_data[i].total);
        var pembayaran = int_price * int_total;

        data_app += `<tr>`;

        data_app +=
          `<td>${list_data[i].total}</td>` +
          `<td>${list_data[i].name}</td>` +
          `<td>${pembayaran}</td>`;

        data_app += `</tr>`;

        total_pembayaran += pembayaran;
      }

      data_app += `</tbody></table>`;

      data_app += `<div class="pesanan"><p>Total Pembayaran : ${total_pembayaran}</p> <button id="buttonPesan" class="btn btn-success btn-small">Pesan Sekarang</button>`;
    } else {
      data_app = "Silahkan Pilih Menu Dahulu";
    }

    $(".checkout").html(data_app);
    $(".checkout").hide();
    $(".checkout").fadeIn(100);
  }
}

function ubahPesanan(data) {
  if (localStorage.list_data) {
    list_data = JSON.parse(localStorage.getItem("list_data"));
  } else {
    list_data = [];
  }

  for (i in list_data) {
    if (list_data[i].id == data.id) {
      list_data[i].total = data.total;

      list_data.splice(i, 1);
    }
  }

  list_data.push(data);

  localStorage.setItem("list_data", JSON.stringify(list_data));
}

function hapusPesanan(data) {
  if (localStorage.list_data) {
    list_data = JSON.parse(localStorage.getItem("list_data"));

    for (i in list_data) {
      if (list_data[i].id == data.id) {
        list_data.splice(i, 1);
      }
    }

    localStorage.setItem("list_data", JSON.stringify(list_data));
  }
}
